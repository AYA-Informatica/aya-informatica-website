import type { ReactNode } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { routing } from "@/i18n/routing"

/**
 * Shared shell for the legal pages.
 *
 * The body is authored as MDX so it can be edited as prose rather than JSX.
 * Translations are provided per locale, but the English version remains the
 * legally governing text — a privacy policy and terms of use are legally
 * operative documents, so a translation is offered for convenience and the
 * non-English pages say so explicitly.
 */
export function LegalPage({
  locale,
  title,
  lastUpdated,
  children,
}: {
  locale: string
  title: string
  lastUpdated: string
  children: ReactNode
}) {
  const t = useTranslations("legal")
  const isDefaultLocale = locale === routing.defaultLocale

  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────── */}
      <section className="bg-surface-inverse py-20 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+5rem)] relative overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50 block mb-3">
            {t("eyebrow")}
          </span>
          <h1
            className="font-display font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            {title}
          </h1>
          <p className="text-white/55 text-sm">
            {t("lastUpdated")}: <time dateTime={lastUpdated}>{lastUpdated}</time>
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────── */}
      <div className="bg-surface-raised">
        <div className="container py-16 max-w-3xl">
          {!isDefaultLocale && (
            <div className="mb-10 rounded-xl border border-accent/30 bg-accent/5 px-5 py-4">
              <p className="text-sm text-content leading-relaxed">
                {t("translationNotice")}
              </p>
            </div>
          )}

          <article lang={locale}>{children}</article>

          <div className="flex flex-wrap gap-4 mt-12 pt-8 border-t border-border-subtle">
            <Link href="/" className="text-sm font-semibold text-accent hover:underline">
              {t("backHome")}
            </Link>
            <Link href="/contact" className="text-sm font-semibold text-accent hover:underline">
              {t("contactUs")}
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
