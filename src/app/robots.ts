import type { MetadataRoute } from "next"

import { BASE_URL } from "@/lib/urls"

/**
 * FIX #7: Generates /robots.txt automatically via Next.js App Router.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  }
}
