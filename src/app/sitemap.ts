import type { MetadataRoute } from "next"
import { locales } from "@/i18n/config"
import { localeAlternates, localeUrl } from "@/lib/urls"

/**
 * Generates /sitemap.xml via Next.js App Router.
 *
 * Every route is emitted once per locale, each entry carrying `alternates.languages`
 * so crawlers understand the translations are the same page rather than duplicates.
 * Priorities reflect relative importance; changeFrequency reflects how often
 * content actually changes.
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
    { path: "/blog",    priority: 0.8, changeFrequency: "weekly"   },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly"   },
    { path: "/privacy", priority: 0.3, changeFrequency: "yearly"   },
    { path: "/terms",   priority: 0.3, changeFrequency: "yearly"   },
  ]

  const lastModified = new Date()

  return routes.flatMap(({ path, priority, changeFrequency }) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      lastModified,
      changeFrequency,
      priority,
      alternates: { languages: localeAlternates(path) },
    }))
  )
}
