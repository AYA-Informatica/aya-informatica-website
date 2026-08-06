import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { useServices } from "@/lib/content"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeAlternates, localeUrl } from "@/lib/urls"

/** Ids for the process and differentiator sections — copy lives in messages. */
const PROCESS_STEPS = [
  { id: "discover", step: "01" },
  { id: "design", step: "02" },
  { id: "build", step: "03" },
  { id: "scale", step: "04" },
] as const

const WHY_ITEMS = ["localKnowledge", "mobileFirst", "productDriven", "trustFirst"] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "services" })
  const path = "/services"
  const url = localeUrl(locale, path)

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url, languages: localeAlternates(path) },
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: t("ogTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("twitterTitle"),
      description: t("twitterDescription"),
    },
  }
}

export default function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("services")
  const services = useServices()

  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: t("breadcrumb"), href: "/services" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv><span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{t("eyebrow")}</span></MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("headline")}<br /><span className="text-accent">{t("headlineAccent")}</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              {t("sub")}
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────── */}
      {services.map((svc, i) => (
        <section
          key={svc.id}
          id={`svc-${svc.id}`}
          className={cn("py-20 border-b border-brand-gray-light scroll-mt-[calc(var(--navbar-height)+1rem)]", i % 2 === 0 ? "bg-white" : "bg-brand-bg")}
          aria-labelledby={`svc-${svc.id}-heading`}
        >
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <MotionDiv>
              <div className="font-display text-5xl font-extrabold text-navy/6 leading-none mb-2 select-none" aria-hidden="true">
                {svc.step}
              </div>
              <h2 id={`svc-${svc.id}-heading`} className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">
                {svc.title}
              </h2>
              <p className="text-accent font-medium text-sm mb-4">{svc.tagline}</p>
              <p className="text-brand-gray text-sm leading-relaxed mb-7">{svc.description}</p>
              <Button asChild size="default">
                <Link href="/contact?subject=services">{t("discussProject")}</Link>
              </Button>
            </MotionDiv>

            <MotionDiv delay={0.15}>
              <div className={cn("rounded-2xl p-7", i % 2 === 0 ? "bg-navy" : "bg-white border border-brand-gray-light")}>
                <h3 className={cn("text-xs font-semibold uppercase tracking-[0.1em] mb-5", i % 2 === 0 ? "text-white/40" : "text-brand-gray")}>
                  {t("whatThisIncludes")}
                </h3>
                <ul className="flex flex-col gap-4">
                  {svc.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-3">
                      <CheckCircle2 size={15} className="text-accent shrink-0 mt-0.5" />
                      <span className={cn("text-sm leading-snug", i % 2 === 0 ? "text-white/70" : "text-brand-dark")}>
                        {cap}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionDiv>
          </div>
        </section>
      ))}

      {/* ── PROCESS ──────────────────────────── */}
      <section className="bg-navy py-24">
        <div className="container">
          <SectionHeader eyebrow={t("processEyebrow")} title={t("processTitle")} light className="mb-14" />
          <MotionList className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS_STEPS.map(({ id, step }) => (
              <MotionItem key={id}>
                <div className="bg-white/4 border border-white/7 rounded-xl p-6 hover:border-accent hover:bg-accent/5 transition-all duration-200">
                  <div className="text-xs font-bold text-accent tracking-wider mb-4">{step}</div>
                  <h3 className="font-display font-semibold text-white text-base mb-2">{t(`process.${id}.title`)}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{t(`process.${id}.desc`)}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── WHY AYA ──────────────────────────── */}
      <section className="bg-brand-bg py-24">
        <div className="container">
          <SectionHeader eyebrow={t("whyEyebrow")} title={t("whyTitle")} className="mb-14" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {WHY_ITEMS.map((id) => (
              <MotionItem key={id}>
                <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-brand-gray-light hover:border-accent hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-navy text-sm mb-1">{t(`why.${id}.title`)}</h4>
                    <p className="text-xs text-brand-gray leading-relaxed">{t(`why.${id}.desc`)}</p>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-white border-t border-brand-gray-light py-20">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">{t("ctaTitle")}</h2>
                <p className="text-brand-gray">{t("ctaDesc")}</p>
              </div>
              <Button asChild size="lg"><Link href="/contact">{t("ctaButton")}</Link></Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
