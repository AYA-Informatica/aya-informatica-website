import type { Metadata } from "next"
import type { MDXProps } from "mdx/types"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { LegalPage } from "@/components/shared/legal-page"
import { localeUrl } from "@/lib/urls"
import { routing } from "@/i18n/routing"
import TermsEn from "@/content/legal/terms.en.mdx"
import TermsFr from "@/content/legal/terms.fr.mdx"
import TermsRw from "@/content/legal/terms.rw.mdx"

const LAST_UPDATED = "June 2025"

/**
 * Statically imported so each translation is bundled and prerendered. The
 * English document remains the legally governing text — see LegalPage.
 */
const CONTENT: Record<string, (props: MDXProps) => React.JSX.Element> = {
  en: TermsEn,
  fr: TermsFr,
  rw: TermsRw,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "legal" })

  return {
    title: t("termsTitle"),
    description: t("termsDescription"),
    robots: { index: true, follow: true },
    alternates: { canonical: localeUrl(locale, "/terms") },
  }
}

export default function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("legal")
  const Content = CONTENT[locale] ?? CONTENT[routing.defaultLocale]

  return (
    <LegalPage locale={locale} title={t("termsTitle")} lastUpdated={LAST_UPDATED}>
      <Content />
    </LegalPage>
  )
}
