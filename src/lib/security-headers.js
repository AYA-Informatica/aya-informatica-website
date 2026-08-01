/**
 * Single source of truth for the security headers.
 *
 * These are applied in two places — `next.config.js` (static header rules) and
 * `src/proxy.ts` (per-request, covering routes the static rules miss). They
 * were previously duplicated verbatim in both files, which meant any change to
 * the CSP had to be made twice or the two would silently disagree.
 *
 * CommonJS so that `next.config.js` can require it directly; TypeScript picks
 * it up through `allowJs` + `esModuleInterop`.
 */

// Cloudflare Turnstile loads a script and renders its challenge in an iframe.
// The CSP is only widened for it when a site key is actually configured, so a
// deployment that does not use Turnstile keeps the tighter policy.
const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
const TURNSTILE_ORIGIN = "https://challenges.cloudflare.com"

/** @param {string[]} sources */
const withTurnstile = (sources) =>
  turnstileEnabled ? [...sources, TURNSTILE_ORIGIN] : sources

const CSP_DIRECTIVES = {
  "default-src": ["'self'"],
  "script-src": withTurnstile([
    "'self'",
    "'unsafe-inline'",
    "https://vercel.live",
    "https://va.vercel-scripts.com",
  ]),
  "style-src": ["'self'", "'unsafe-inline'"],
  "font-src": ["'self'", "data:"],
  "img-src": ["'self'", "data:", "blob:"],
  "connect-src": withTurnstile([
    "'self'",
    "https://vercel.live",
    "wss://ws-us3.pusher.com",
    "https://vitals.vercel-insights.com",
    "https://va.vercel-scripts.com",
  ]),
  // Without an explicit frame-src the Turnstile iframe falls back to
  // default-src 'self' and is blocked.
  "frame-src": withTurnstile(["'self'"]),
  "frame-ancestors": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
}

const CONTENT_SECURITY_POLICY = Object.entries(CSP_DIRECTIVES)
  .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
  .join("; ")

/** @type {Record<string, string>} */
const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=()",
  "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
}

/** Same headers in the `{ key, value }[]` shape `next.config.js` expects. */
const SECURITY_HEADERS_LIST = Object.entries(SECURITY_HEADERS).map(([key, value]) => ({
  key,
  value,
}))

module.exports = {
  CONTENT_SECURITY_POLICY,
  SECURITY_HEADERS,
  SECURITY_HEADERS_LIST,
  TURNSTILE_ORIGIN,
  turnstileEnabled,
}
