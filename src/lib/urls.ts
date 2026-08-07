import { type Locale, locales } from "@/i18n/config"
import { routing } from "@/i18n/routing"

/**
 * Normalises an origin to the host that is actually served.
 *
 * Vercel serves this site on www and 308s the apex to it, so a canonical, a
 * sitemap entry or an hreflang alternate naming the apex points at a redirect.
 * Google is then told to index a URL that immediately sends it somewhere else,
 * and the page it lands on canonicalises back to the URL it just left.
 *
 * `NEXT_PUBLIC_SITE_URL` cannot be relied on to say www. It is set in the
 * Vercel dashboard, which overrides the value in vercel.json, and it currently
 * names the apex — the deployed build proved it: the new page titles shipped
 * while the canonicals stayed apex. Rather than depend on a setting this
 * codebase cannot see or change, the correct host is enforced here.
 *
 * Only a bare two-label apex is rewritten. `localhost:3000` has no dot to
 * split on and a preview host like `aya-git-main.vercel.app` has three labels,
 * so neither is touched — prefixing www there would break both.
 */
export function canonicalOrigin(url: string): string {
  try {
    const parsed = new URL(url)
    const isBareApex = !parsed.host.startsWith("www.") && parsed.hostname.split(".").length === 2
    if (isBareApex) parsed.host = `www.${parsed.host}`
    return parsed.origin
  } catch {
    // A malformed value should not take the whole build down.
    return url
  }
}

export const BASE_URL = canonicalOrigin(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.ayainformatica.tech"
)

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

/**
 * `{ en, fr, rw, "x-default" }` for a path — used for hreflang alternates.
 *
 * `x-default` points at the default locale and is what Google serves when a
 * visitor's language matches none of the alternates. Without it, unmatched
 * users get whichever version Google guesses.
 */
export function localeAlternates(path = ""): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l: Locale) => [l, localeUrl(l, path)])),
    "x-default": localeUrl(routing.defaultLocale, path),
  }
}
