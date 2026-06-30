import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// ─────────────────────────────────────────────────────────────
// SECURITY MIDDLEWARE
// Handles: CORS, rate limiting, security headers, method guards
// ─────────────────────────────────────────────────────────────

// ── Upstash Redis rate limiter (production) ──────────────────

const hasRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)

let contactLimiter: Ratelimit | null = null
let defaultLimiter: Ratelimit | null = null

function getContactLimiter() {
  if (!contactLimiter && hasRedis) {
    contactLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      analytics: true,
      prefix: "aya-rl-contact",
    })
  }
  return contactLimiter
}

function getDefaultLimiter() {
  if (!defaultLimiter && hasRedis) {
    defaultLimiter = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(60, "1 m"),
      analytics: true,
      prefix: "aya-rl-default",
    })
  }
  return defaultLimiter
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

function isRateLimitedFallback(ip: string, pathname: string): boolean {
  cleanupExpired()
  const now = Date.now()
  const max = pathname === "/api/contact" ? 5 : 60
  const key = `${ip}:${pathname}`
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

const ALLOWED_ORIGINS = new Set([
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.tech",
])

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

// ── Rate limit check (unified) ───────────────────────────────

async function checkRateLimit(ip: string, pathname: string): Promise<NextResponse | null> {
  const isContact = pathname === "/api/contact"
  const limiter = isContact ? getContactLimiter() : getDefaultLimiter()

  if (limiter) {
    const { success, limit, remaining, reset } = await limiter.limit(ip)
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(limit),
            "X-RateLimit-Remaining": String(remaining),
            "X-RateLimit-Reset": String(reset),
          },
        },
      )
    }
    return null
  }

  if (isRateLimitedFallback(ip, pathname)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": "60" } },
    )
  }
  return null
}

// ── Security headers ─────────────────────────────────────────

const SECURITY_HEADERS: Record<string, string> = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com https://vitals.vercel-insights.com https://va.vercel-scripts.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}

const SKIP_PATTERN = /^\/((_next\/static|_next\/image|favicon\.ico|og-image)\/|.*\.svg$)/

// ── Middleware entry point ────────────────────────────────────

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (SKIP_PATTERN.test(pathname)) return NextResponse.next()

  const origin = request.headers.get("origin")
  const isApiRoute = pathname.startsWith("/api/")

  if (isApiRoute) {
    const allowedOrigin = getCorsOrigin(origin)

    if (request.method === "OPTIONS") return handlePreflight(allowedOrigin)
    if (origin && !allowedOrigin) return rejectOrigin()

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    const rateLimitResponse = await checkRateLimit(ip, pathname)
    if (rateLimitResponse) return rateLimitResponse
  }

  const response = NextResponse.next()
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
