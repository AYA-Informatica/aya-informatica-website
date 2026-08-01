import type { Metadata } from "next"
import type { MDXProps } from "mdx/types"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { LegalPage } from "@/components/shared/legal-page"
import { localeUrl } from "@/lib/urls"
import { routing } from "@/i18n/routing"
import PrivacyEn from "@/content/legal/privacy.en.mdx"
import PrivacyFr from "@/content/legal/privacy.fr.mdx"
import PrivacyRw from "@/content/legal/privacy.rw.mdx"

const LAST_UPDATED = "June 2025"

/**
 * Statically imported so each translation is bundled and prerendered. The
 * English document remains the legally governing text — see LegalPage.
 */
const CONTENT: Record<string, (props: MDXProps) => React.JSX.Element> = {
  en: PrivacyEn,
  fr: PrivacyFr,
  rw: PrivacyRw,
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "legal" })

  return {
    title: t("privacyTitle"),
    description: t("privacyDescription"),
    robots: { index: true, follow: true },
    alternates: { canonical: localeUrl(locale, "/privacy") },
  }
}

export default function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("legal")
  const Content = CONTENT[locale] ?? CONTENT[routing.defaultLocale]

  return (
    <LegalPage locale={locale} title={t("privacyTitle")} lastUpdated={LAST_UPDATED}>
      <Content />
    </LegalPage>
  )
}
