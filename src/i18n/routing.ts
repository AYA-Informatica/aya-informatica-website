import { defineRouting } from "next-intl/routing"
import { defaultLocale, locales } from "./config"

/**
 * Locale routing configuration.
 *
 * `localePrefix: "as-needed"` keeps the default locale unprefixed:
 *
 *   English      /about
 *   French       /fr/about
 *   Kinyarwanda  /rw/about
 *
 * This matters for SEO — the English URLs are already indexed under
 * ayainformatica.tech, and prefixing them to /en/* would invalidate that.
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
})
