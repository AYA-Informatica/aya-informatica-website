import type { Metadata } from "next"
import { Suspense, use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ContactForm } from "@/components/sections/contact-form"
import { TopicTags } from "@/components/sections/topic-tags"
import { MotionDiv } from "@/components/shared/motion-div"
import { CONTACT_INFO } from "@/lib/constants"
import { Mail, Phone, MapPin } from "lucide-react"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeUrl } from "@/lib/urls"

/** Presentation only — labels come from the `contact` message namespace. */
const CLOSING_BADGES = [
  { id: "builders", icon: "\u{1F528}" },
  { id: "engineers", icon: "\u2699\uFE0F" },
  { id: "thinkers", icon: "\u{1F4A1}" },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "contact" })
  const url = localeUrl(locale, "/contact")

  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: url },
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

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("contact")

  const details = [
    { id: "email", icon: <Mail size={16} />, value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
    { id: "phone", icon: <Phone size={16} />, value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, "")}` },
    { id: "location", icon: <MapPin size={16} />, value: CONTACT_INFO.location, href: undefined },
  ]

  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: t("breadcrumb"), href: "/contact" }]} />
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

      {/* ── MAIN CONTACT SECTION ─────────────── */}
      <section className="bg-brand-bg py-24" aria-labelledby="contact-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14 items-start">

          {/* Sidebar info — on mobile, shows after the form via order */}
          <MotionDiv className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <h2 id="contact-heading" className="font-display font-bold text-2xl text-navy mb-3">
                {t("getInTouch")}
              </h2>
              <p className="text-sm text-brand-gray leading-relaxed mb-8">
                {t("basedIn")}
              </p>

              <div className="flex flex-col gap-5 mb-8">
                {details.map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy/8 text-navy flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-brand-gray mb-0.5">
                        {t(`details.${item.id}`)}
                      </span>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-brand-dark hover:text-accent transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-brand-dark">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Topic tags — clicking scrolls to form and pre-fills subject */}
              <TopicTags />
            </div>
          </MotionDiv>

          {/* Contact form — on mobile, shows first via order */}
          <MotionDiv delay={0.15} className="order-1 lg:order-2">
            <Suspense>
              <ContactForm />
            </Suspense>
          </MotionDiv>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────── */}
      <section className="bg-navy py-16">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-wrap">
              <div>
                <blockquote className="font-display text-xl sm:text-2xl font-bold italic text-white mb-2">
                  &ldquo;{t("closingQuote")}&rdquo;
                </blockquote>
                <cite className="text-xs text-white/30 not-italic">— {t("closingAttribution")}</cite>
              </div>
              <div className="flex gap-3">
                {CLOSING_BADGES.map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-5 py-4">
                    <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    <span className="text-xs text-white/55 font-medium">{t(`closingBadges.${item.id}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
