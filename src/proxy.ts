import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"
// Security headers are defined once in src/lib/security-headers.js and shared
// with next.config.js so the two cannot drift apart.
import { SECURITY_HEADERS } from "@/lib/security-headers"
import {
  exceedsBodyLimit,
  isAllowedMethod,
  hostVariants,
  isProbePath,
  resolveClientIp,
  tierFor,
  type RateTier,
} from "@/lib/traffic-guard"

// ─────────────────────────────────────────────────────────────
// SECURITY PROXY
// Handles: CORS, rate limiting, security headers, method guards
//
// Next.js 16 renamed the `middleware` file convention to `proxy`
// (same signature, same request/response APIs).
// See: https://nextjs.org/docs/messages/middleware-to-proxy
// ─────────────────────────────────────────────────────────────

// ── Upstash Redis rate limiter (production) ──────────────────

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

const limiters = new Map<string, Ratelimit>()

/** One Upstash limiter per tier, created on first use and reused after. */
function getLimiter(tier: RateTier): Ratelimit | null {
  if (!hasRedis) return null
  let limiter = limiters.get(tier.name)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(tier.max, tier.window),
      analytics: true,
      prefix: `aya-rl-${tier.name}`,
    })
    limiters.set(tier.name, limiter)
  }
  return limiter
}

// ── In-memory fallback rate limiter (development) ────────────

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const CLEANUP_INTERVAL = 60_000
let lastCleanup = Date.now()

function cleanupExpired() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  rateLimitMap.forEach((entry, key) => {
    if (now > entry.resetAt) rateLimitMap.delete(key)
  })
}

function isRateLimitedFallback(ip: string, tier: RateTier): boolean {
  cleanupExpired()
  const now = Date.now()
  const max = tier.max
  // Keyed by tier, not by path. Keying on the full path handed a crawler a
  // fresh budget for every distinct URL it invented, which made the limit
  // meaningless for exactly the traffic it exists to stop.
  const key = `${ip}:${tier.name}`
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + 60_000 })
    return false
  }
  if (entry.count >= max) return true
  entry.count++
  return false
}

// ── CORS ─────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set(
  hostVariants(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ayainformatica.tech")
)

function getCorsOrigin(origin: string | null): string | null {
  if (!origin) return null
  if (ALLOWED_ORIGINS.has(origin)) return origin
  if (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost")) {
    return origin
  }
  return null
}

function handlePreflight(allowedOrigin: string | null) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": allowedOrigin ?? "",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  })
}

function rejectOrigin() {
  return NextResponse.json({ error: "CORS: origin not allowed" }, { status: 403 })
}

/**
 * Methods that change server state and therefore require a trusted Origin.
 *
 * Per the Fetch specification a browser attaches `Origin` to every request
 * except a same-origin GET/HEAD — including same-origin POSTs. A POST with no
 * Origin header is therefore not coming from a browser, and previously slipped
 * past the CORS check entirely because that check was skipped when the header
 * was absent.
 */
const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"])

// ── Rate limit check (unified) ───────────────────────────────

/**
 * Applies the tier for this path.
 *
 * A page hitting the limit gets HTML-friendly plain text rather than a JSON
 * body, since a browser navigating to a page will render whatever comes back.
 */
async function checkRateLimit(
  ip: string,
  pathname: string,
  isApiRoute: boolean,
): Promise<NextResponse | null> {
  const tier = tierFor(pathname)
  const limiter = getLimiter(tier)

  let exceeded: boolean
  let headers: Record<string, string> = { "Retry-After": "60" }

  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(`${tier.name}:${ip}`)
    exceeded = !success
    headers = {
      ...headers,
      "X-RateLimit-Limit": String(limit),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(reset),
    }
  } else {
    exceeded = isRateLimitedFallback(ip, tier)
  }

  if (!exceeded) return null

  return isApiRoute
    ? NextResponse.json({ error: "Too many requests. Please try again later." }, {
        status: 429,
        headers,
      })
    : new NextResponse("Too many requests. Please try again in a minute.", {
        status: 429,
        headers: { ...headers, "Content-Type": "text/plain; charset=utf-8" },
      })
}

// ── Security headers ─────────────────────────────────────────


const SKIP_PATTERN = /^\/((_next\/static|_next\/image|favicon\.ico|og-image)\/|.*\.svg$)/

// ── Locale routing ───────────────────────────────────────────

const handleI18nRouting = createMiddleware(routing)

/**
 * Whether a request should go through locale negotiation.
 *
 * Only real page routes are localized. Anything with a file extension is a
 * static asset or a well-known file that must keep its exact URL — this
 * deliberately covers /robots.txt, /sitemap.xml, /manifest.json and the Google
 * Search Console verification file, all of which would break if redirected to
 * a locale-prefixed path.
 */
function shouldLocalize(pathname: string): boolean {
  if (pathname.startsWith("/api/")) return false
  if (pathname.startsWith("/_next/")) return false
  if (pathname.includes(".")) return false
  return true
}

// ── Proxy entry point ─────────────────────────────────────────

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (SKIP_PATTERN.test(pathname)) return NextResponse.next()

  // ── Cheap rejections first ─────────────────────────────────
  // Each of these is a string comparison, and each one that fires saves the
  // work of everything below it. Ordering matters: a scanner sweeping for
  // /wp-login.php should cost a prefix match, not a rate-limit round trip.

  // 404 rather than 403: a scanner learns nothing from "not found", whereas
  // "forbidden" confirms something is there to forbid.
  if (isProbePath(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  if (!isAllowedMethod(request.method)) {
    return new NextResponse(null, {
      status: 405,
      headers: { Allow: "GET, HEAD, POST, OPTIONS" },
    })
  }

  const origin = request.headers.get("origin")
  const isApiRoute = pathname.startsWith("/api/")

  // OPTIONS on a page route. Left to fall through, next-intl answers it with a
  // 400, which is a confusing reply to a legitimate question about what a URL
  // supports — and one that uptime monitors do ask.
  if (request.method === "OPTIONS" && !isApiRoute) {
    return new NextResponse(null, {
      status: 204,
      headers: { Allow: "GET, HEAD, OPTIONS" },
    })
  }

  if (isApiRoute) {
    const allowedOrigin = getCorsOrigin(origin)

    if (request.method === "OPTIONS") return handlePreflight(allowedOrigin)
    if (origin && !allowedOrigin) return rejectOrigin()

    // A state-changing request must carry an Origin the allowlist recognises.
    // Without this, omitting the header altogether bypassed the check above.
    if (STATE_CHANGING_METHODS.has(request.method) && !allowedOrigin) {
      return rejectOrigin()
    }

    // Refused on the declared length, before the body is read at all.
    if (exceedsBodyLimit(request.headers)) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }
  }

  // ── Rate limiting, now on every route rather than just the API ──
  // Page routes were previously unlimited, so anything that was not an API call
  // could be requested as fast as the network allowed.
  const ip = resolveClientIp(request.headers)
  const rateLimitResponse = await checkRateLimit(ip, pathname, isApiRoute)
  if (rateLimitResponse) return rateLimitResponse

  // Locale negotiation runs only after the API guards above, so rate limiting
  // and CORS still short-circuit before any i18n work happens. next-intl may
  // return a rewrite or a redirect; security headers are attached to whichever
  // response it produces rather than to a fresh one, so they are never lost.
  const response = shouldLocalize(pathname)
    ? handleI18nRouting(request)
    : NextResponse.next()

  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    response.headers.set(key, value)
  }

  if (isApiRoute && origin) {
    const allowedOrigin = getCorsOrigin(origin)
    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin)
    }
  }

  return response
}

/**
 * Which requests reach this proxy at all.
 *
 * Without a matcher, Next runs it for every request — including each static
 * chunk, font and image. SKIP_PATTERN then returns immediately, but the
 * invocation has already happened, and on Vercel an invocation is billed and
 * adds latency whether or not it does anything. Excluding static assets here
 * means a flood of asset requests never wakes this code at all.
 *
 * Documents, API routes, /robots.txt and /sitemap.xml are deliberately still
 * matched: they need the security headers, and the first two need the guards.
 */
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|mp4|webm)$).*)",
  ],
}
