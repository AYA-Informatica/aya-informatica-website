import { type Locale, locales } from "@/i18n/config"
import { routing } from "@/i18n/routing"

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.tech"

/**
 * Absolute URL for a path in a given locale.
 *
 * `localePrefix: "as-needed"` leaves the default locale unprefixed, so English
 * lives at `/about` while the others live at `/fr/about`. Defined once here
 * because the layout, the page metadata and the sitemap must all agree — a
 * mismatch would emit conflicting canonical and hreflang URLs.
 */
export function localeUrl(locale: string, path = "") {
  const prefix = locale === routing.defaultLocale ? "" : `/${locale}`
  if (path === "" || path === "/") {
    return prefix ? `${BASE_URL}${prefix}` : `${BASE_URL}/`
  }
  return `${BASE_URL}${prefix}${path}`
}

/** `{ en: "…", fr: "…", rw: "…" }` for a path — used for hreflang alternates. */
export function localeAlternates(path = ""): Record<string, string> {
  return Object.fromEntries(locales.map((l: Locale) => [l, localeUrl(l, path)]))
}
