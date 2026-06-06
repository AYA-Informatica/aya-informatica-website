/** @type {import('next').NextConfig} */
const nextConfig = {
  // ── Security Headers ───────────────────────────────────────
  // Applied at the CDN/edge level by Next.js on every response.
  // The middleware also sets these — this config ensures they're
  // present even if middleware is bypassed (e.g. static files).
  async headers() {
    return [
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
              // Fonts are self-hosted via @fontsource — no Google Fonts needed
              // Vercel Live feedback in development
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "img-src 'self' data: blob:",
              // API route proxies to email provider — browser only calls /api/contact
              // Vercel Live websockets for real-time feedback
              "connect-src 'self' https://vercel.live wss://ws-us3.pusher.com",
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
    return [
      // Force trailing-slash consistency
      // (remove if you prefer trailing slashes)
    ]
  },

  // ── Build hardening ────────────────────────────────────────
  // Prevent source maps being served in production
  productionBrowserSourceMaps: false,

  // Compress responses
  compress: true,

  // Power-on header removal (don't advertise Next.js version)
  poweredByHeader: false,
}

module.exports = nextConfig
