/**
 * Traffic filtering for the edge proxy.
 *
 * Everything here runs before the application does any work, so each check is a
 * string comparison against headers or the path — no I/O, no allocation beyond
 * what a lookup needs.
 *
 * Scope, stated plainly: this layer stops scrapers, vulnerability scanners and
 * abusive clients. It does NOT stop a distributed denial of service. By the
 * time a request reaches this code the connection, the bandwidth and the
 * function invocation have already been paid for. Volumetric defence has to sit
 * in front of the origin — see SECURITY.md.
 */

/** Headers a proxy sets, most trustworthy first. */
const CLIENT_IP_HEADERS = [
  // Cloudflare overwrites this on every request and strips any client-supplied
  // copy, so it cannot be forged by the caller when traffic arrives via CF.
  "cf-connecting-ip",
  // Vercel sets both from the real TCP peer, independently of what the client
  // sent, which makes them safe to trust on Vercel.
  "x-vercel-forwarded-for",
  "x-real-ip",
] as const

/**
 * Resolves the address to attribute a request to.
 *
 * `x-forwarded-for` is deliberately last. It is a client-supplied header that
 * proxies append to rather than replace, so its leftmost entry is whatever the
 * caller decided to put there. Keying a rate limiter on it means an attacker
 * rotates one header and gets an unlimited budget. It is kept only as a last
 * resort for local development, where none of the above are set.
 */
export function resolveClientIp(headers: Headers): string {
  for (const header of CLIENT_IP_HEADERS) {
    const value = headers.get(header)?.trim()
    if (value) return value.split(",")[0]!.trim()
  }
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim()
  return forwarded || "unknown"
}

/** True when the request demonstrably arrived through Cloudflare. */
export function viaCloudflare(headers: Headers): boolean {
  return headers.has("cf-connecting-ip") && headers.has("cf-ray")
}

/**
 * Paths that only ever appear in automated scans of this site.
 *
 * Matched as prefixes against a lowercased path. None of these collide with a
 * real route: every page here is a bare word under an optional locale segment,
 * and the legitimate dotted paths (/robots.txt, /sitemap.xml, /manifest.json)
 * are matched exactly rather than by prefix.
 *
 * Blocking them is not a security control on its own — there is no WordPress
 * here to find. It exists to keep the noise out of the logs and to stop a
 * scanner burning the rate-limit budget of everyone sharing its address.
 */
const PROBE_PREFIXES = [
  "/wp-admin",
  "/wp-content",
  "/wp-includes",
  "/wp-login",
  "/wordpress",
  "/xmlrpc.php",
  "/phpmyadmin",
  "/phpmyadmin2",
  "/pma",
  "/adminer",
  "/administrator",
  "/cgi-bin",
  "/vendor/phpunit",
  "/.env",
  "/.git",
  "/.svn",
  "/.hg",
  "/.aws",
  "/.ssh",
  "/.vscode",
  "/.idea",
  "/.ds_store",
  "/config.php",
  "/configuration.php",
  "/shell",
  "/backup.sql",
  "/dump.sql",
  "/telescope/requests",
  "/actuator/",
  "/solr/",
  "/druid/",
] as const

/** Files that are legitimate at the root and must never be prefix-matched. */
const WELL_KNOWN_EXACT = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
  "/favicon.ico",
  "/favicon.svg",
  "/sw.js",
])

export function isProbePath(pathname: string): boolean {
  const path = pathname.toLowerCase()
  if (WELL_KNOWN_EXACT.has(path)) return false
  if (path.startsWith("/.well-known/")) return false
  return PROBE_PREFIXES.some((prefix) => path.startsWith(prefix))
}

/**
 * Methods this site answers.
 *
 * There are no PUT/PATCH/DELETE endpoints, and TRACE has a long history of
 * being turned into a cross-site tracing primitive, so anything outside this
 * set is refused before routing.
 */
const ALLOWED_METHODS = new Set(["GET", "HEAD", "POST", "OPTIONS"])

export function isAllowedMethod(method: string): boolean {
  return ALLOWED_METHODS.has(method.toUpperCase())
}

/**
 * Largest body the contact endpoint will consider.
 *
 * The schema caps the message at 2000 characters and every other field is far
 * smaller, so a legitimate submission is a couple of kilobytes at most. 16KB
 * leaves generous headroom for multi-byte scripts and the Turnstile token while
 * still refusing a payload meant to exhaust the parser.
 */
export const MAX_BODY_BYTES = 16 * 1024

export function exceedsBodyLimit(headers: Headers, limit = MAX_BODY_BYTES): boolean {
  const declared = Number(headers.get("content-length"))
  return Number.isFinite(declared) && declared > limit
}

/** A named rate-limit tier. */
export interface RateTier {
  name: string
  /** Requests permitted per window. */
  max: number
  /** Sliding window, in the format Upstash expects. */
  window: `${number} ${"s" | "m" | "h"}`
}

/**
 * Tiers, strictest first.
 *
 * Page traffic gets a deliberately generous budget. Carrier-grade NAT is
 * widespread in Rwanda and much of East Africa, so a single address can front a
 * large number of genuine visitors; a tight page limit would lock out real
 * users long before it inconvenienced anyone. Static assets never reach this
 * code, so the page budget only counts document requests.
 */
export const RATE_TIERS = {
  contact: { name: "contact", max: 5, window: "1 m" },
  api: { name: "api", max: 30, window: "1 m" },
  page: { name: "page", max: 200, window: "1 m" },
} as const satisfies Record<string, RateTier>

export function tierFor(pathname: string): RateTier {
  if (pathname === "/api/contact") return RATE_TIERS.contact
  if (pathname.startsWith("/api/")) return RATE_TIERS.api
  return RATE_TIERS.page
}

/**
 * Both host spellings of a site URL — apex and www.
 *
 * Vercel serves this site on www and 308s the apex to it, while
 * NEXT_PUBLIC_SITE_URL names the apex. An allowlist holding only the configured
 * spelling rejected the Origin a real browser sends, because that is the www
 * one the redirect lands on, and every contact submission in production
 * returned 403 from the site's own CORS check.
 *
 * Accepting both spellings fixes that and stays correct whichever is later made
 * canonical. It widens the allowlist by exactly one host and nothing else.
 */
export function hostVariants(siteUrl: string): string[] {
  try {
    const url = new URL(siteUrl)
    const bare = url.host.replace(/^www\./, "")
    return [`${url.protocol}//${bare}`, `${url.protocol}//www.${bare}`]
  } catch {
    // A malformed value should not take the whole proxy down; the original
    // string simply matches nothing.
    return [siteUrl]
  }
}
