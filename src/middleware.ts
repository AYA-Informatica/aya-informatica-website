import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// ─────────────────────────────────────────────────────────────
// SECURITY MIDDLEWARE
// Handles: CORS, rate limiting, security headers, method guards
// ─────────────────────────────────────────────────────────────

// ── In-memory rate limiter (edge-compatible) ─────────────────
// For production at scale, swap the Map for an Upstash Redis store:
// https://github.com/upstash/ratelimit
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_RULES: Record<string, { max: number; windowMs: number }> = {
  "/api/contact": { max: 5, windowMs: 60_000 },  // 5 requests / minute
  default:        { max: 60, windowMs: 60_000 }, // 60 requests / minute for all other routes
}

function getRateLimit(pathname: string) {
  return RATE_LIMIT_RULES[pathname] ?? RATE_LIMIT_RULES.default
}

function isRateLimited(ip: string, pathname: string): boolean {
  const now = Date.now()
  const key = `${ip}:${pathname}`
  const rule = getRateLimit(pathname)
  const entry = rateLimitMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + rule.windowMs })
    return false
  }

  if (entry.count >= rule.max) return true

  entry.count++
  return false
}

// ── Allowed origins ──────────────────────────────────────────
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.com",
  // Add staging URL here if needed:
  // "https://staging.ayainformatica.com",
]

// Only enforce CORS on API routes
function getCorsOrigin(origin: string | null): string | null {
  if (!origin) return null
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  // During local development allow localhost
  if (process.env.NODE_ENV === "development" && origin.startsWith("http://localhost")) {
    return origin
  }
  return null
}

// ── Security headers ─────────────────────────────────────────
const SECURITY_HEADERS: Record<string, string> = {
  // Prevent clickjacking
  "X-Frame-Options": "DENY",
  // Prevent MIME-type sniffing
  "X-Content-Type-Options": "nosniff",
  // Referrer policy — don't leak full URL to third-party sites
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Permissions policy — disable unnecessary browser features
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  // Force HTTPS
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  // Content-Security-Policy
  // NOTE: tighten this further if you add third-party embeds
  "Content-Security-Policy": [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "img-src 'self' data: blob:",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join("; "),
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get("origin")
  const isApiRoute = pathname.startsWith("/api/")

  // ── 1. CORS — API routes only ────────────────────────────
  if (isApiRoute) {
    const allowedOrigin = getCorsOrigin(origin)

    // Preflight (OPTIONS) request
    if (request.method === "OPTIONS") {
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

    // Reject requests from unlisted origins (only when an Origin header is present)
    if (origin && !allowedOrigin) {
      return NextResponse.json(
        { error: "CORS: origin not allowed" },
        { status: 403 }
      )
    }

    // ── 2. Rate limiting — API routes ──────────────────────
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown"

    if (isRateLimited(ip, pathname)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": "60",
            "X-RateLimit-Limit": String(getRateLimit(pathname).max),
          },
        }
      )
    }
  }

  // ── 3. Attach security headers to every response ─────────
  const response = NextResponse.next()
  Object.entries(SECURITY_HEADERS).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Attach CORS header to API responses too
  if (isApiRoute && origin) {
    const allowedOrigin = getCorsOrigin(origin)
    if (allowedOrigin) {
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin)
    }
  }

  return response
}

export const config = {
  // Run middleware on all routes except static assets and Next internals
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|og-image|.*\\.svg$).*)",
  ],
}
