const createNextIntlPlugin = require("next-intl/plugin")

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Security Headers ───────────────────────────────────────
  async headers() {
    return [
      {
        source: "/:path(about|products|services|blog|privacy|terms)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options",           value: "DENY" },
          { key: "X-Content-Type-Options",    value: "nosniff" },
          { key: "Referrer-Policy",           value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",        value: "camera=(), microphone=(), geolocation=(), payment=()" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Content-Security-Policy",
            value: [
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
          },
        ],
      },
    ]
  },

  // ── Redirects ──────────────────────────────────────────────
  async redirects() {
    return []
  },

  // ── Build hardening ────────────────────────────────────────
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
}

module.exports = withNextIntl(nextConfig)
