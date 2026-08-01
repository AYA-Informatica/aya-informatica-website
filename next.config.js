const createNextIntlPlugin = require("next-intl/plugin")
const createMDX = require("@next/mdx")
const { SECURITY_HEADERS_LIST } = require("./src/lib/security-headers")

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")
// Legal copy lives in .mdx files so it can be edited as prose rather than JSX.
const withMDX = createMDX({})

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],

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
        // Defined once in src/lib/security-headers.js and shared with the
        // proxy so the two cannot drift apart.
        headers: SECURITY_HEADERS_LIST,
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

module.exports = withNextIntl(withMDX(nextConfig))
