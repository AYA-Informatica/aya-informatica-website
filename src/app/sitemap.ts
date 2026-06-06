import type { MetadataRoute } from "next"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.com"

/**
 * Generates /sitemap.xml via Next.js App Router.
 * Priorities reflect relative importance for crawlers.
 * changeFrequency reflects how often content actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const routes: Array<{
    path: string
    priority: number
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
  }> = [
    { path: "/",        priority: 1.0, changeFrequency: "monthly"  },
    { path: "/about",   priority: 0.8, changeFrequency: "monthly"  },
    { path: "/products",priority: 0.9, changeFrequency: "weekly"   }, // products update more frequently
    { path: "/services",priority: 0.8, changeFrequency: "monthly"  },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly"   },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly"   },
    { path: "/terms",   priority: 0.3, changeFrequency: "yearly"   },
  ]

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }))
}
