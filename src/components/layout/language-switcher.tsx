"use client"

import { useLocale } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { type Locale, localeNames, locales } from "@/i18n/config"
import { cn } from "@/lib/utils"

/**
 * Compact locale switcher.
 *
 * `usePathname` from the i18n navigation helpers returns the path *without* the
 * locale prefix, so switching preserves the current page and query string
 * rather than dropping the visitor back on the home page.
 *
 * The query string is read from `window.location` inside the click handler
 * rather than via `useSearchParams`. This component renders inside the shared
 * layout, and `useSearchParams` would opt every page in the site out of static
 * prerendering unless wrapped in a Suspense boundary.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(next: Locale) {
    if (next === locale) return
    const query = typeof window === "undefined" ? "" : window.location.search
    router.replace(`${pathname}${query}`, { locale: next })
  }

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      role="group"
      aria-label="Language"
    >
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => switchTo(l)}
          lang={l}
          aria-current={l === locale ? "true" : undefined}
          title={localeNames[l]}
          className={cn(
            "px-1.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider rounded transition-colors",
            l === locale
              ? "text-white bg-white/15"
              : "text-white/65 hover:text-white hover:bg-white/10"
          )}
        >
          {l}
          <span className="sr-only"> — {localeNames[l]}</span>
        </button>
      ))}
    </div>
  )
}
