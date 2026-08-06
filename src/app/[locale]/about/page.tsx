import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { useRoadmap, useStats } from "@/lib/content"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeAlternates, localeUrl } from "@/lib/urls"

/** Presentation only — all copy lives in the `about` message namespace. */
const VISION_MISSION = [
  {
    id: "vision",
    isVision: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
        <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.34 6.34l2.83 2.83M22.83 22.83l2.83 2.83M6.34 25.66l2.83-2.83M22.83 9.17l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "mission",
    isVision: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
        <path d="M16 4v18M4 10l12 6 12-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      </svg>
    ),
  },
] as const

const TEAM = [
  {
    id: "founder",
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true"><circle cx="18" cy="12" r="7" stroke="currentColor" strokeWidth="2"/><path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  },
  {
    id: "engineering",
    icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="4" y="6" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M12 16l-4 4 4 4M24 16l4 4-4 4M17 14l2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "about" })
  const path = "/about"
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

export default function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("about")
  const roadmap = useRoadmap()
  const stats = useStats()
  // The overview panel reuses the "founded" and "platforms" headline figures.
  const overviewStats = stats.filter((s) => s.id === "founded" || s.id === "platforms")

  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: t("breadcrumb"), href: "/about" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-surface-inverse py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv delay={0}>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{t("eyebrow")}</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("headline")}<br />
              <span className="text-accent-on-inverse">{t("headlineAccent")}</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              {t("sub")}
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────── */}
      <section className="bg-surface-raised py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <MotionDiv>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent block mb-3">{t("overviewEyebrow")}</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-content-strong mb-6">
              {t("overviewTitleLine1")}<br />{t("overviewTitleLine2")}
            </h2>
            <div className="space-y-4 text-content-muted leading-relaxed">
              <p>{t("overviewP1")}</p>
              <p>{t("overviewP2")}</p>
              <p>{t("overviewP3")}</p>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.15}>
            <div className="bg-surface-inverse rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 border-b border-white/6 divide-x divide-white/6">
                {overviewStats.map((s) => (
                  <div key={s.id} className="p-6 odd:border-r odd:border-white/6">
                    <div className="font-display text-3xl font-extrabold text-white mb-1">{s.value}</div>
                    <div className="text-xs text-white/60 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <blockquote className="font-display text-base font-semibold italic text-white/80 leading-relaxed mb-3">
                  &ldquo;{t("quote")}&rdquo;
                </blockquote>
                <cite className="text-xs text-white/30 not-italic">— {t("quoteAttribution")}</cite>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── VISION & MISSION ─────────────────── */}
      <section className="bg-surface py-24">
        <div className="container">
          <SectionHeader eyebrow={t("visionEyebrow")} title={t("visionTitle")} className="mb-14" />
          <MotionList className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {VISION_MISSION.map((card) => (
              <MotionItem key={card.id}>
                <div className={cn("bg-surface-raised rounded-2xl p-8 border border-border-subtle border-t-[3px] h-full hover:shadow-card-hover transition-shadow", card.isVision ? "border-t-accent" : "border-t-navy")}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5", card.isVision ? "bg-accent/10 text-accent" : "bg-content/8 text-content-strong")}>
                    {card.icon}
                  </div>
                  <span className={cn("text-xs font-semibold uppercase tracking-[0.1em] block mb-3", card.isVision ? "text-accent" : "text-content-strong")}>
                    {t(`visionMission.${card.id}.type`)}
                  </span>
                  <h3 className="font-display font-bold text-xl text-content-strong mb-3">{t(`visionMission.${card.id}.title`)}</h3>
                  <p className="text-sm text-content-muted leading-relaxed">{t(`visionMission.${card.id}.desc`)}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────── */}
      <section className="bg-surface-raised py-24">
        <div className="container">
          <SectionHeader
            eyebrow={t("teamEyebrow")}
            title={<>{t("teamTitleLine1")}<br />{t("teamTitleLine2")}</>}
            description={t("teamDesc")}
            className="mb-14"
          />
          <MotionList className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
            {TEAM.map((member) => (
              <MotionItem key={member.id}>
                <div className="bg-surface rounded-2xl p-7 border border-border-subtle hover:border-accent transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-content/8 flex items-center justify-center text-content-strong mb-5">
                    {member.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-content-strong mb-2">{t(`team.${member.id}.role`)}</h3>
                  <p className="text-sm text-content-muted leading-relaxed">{t(`team.${member.id}.desc`)}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
          <MotionDiv>
            <div className="bg-surface-inverse rounded-xl px-8 py-5 text-center">
              <p className="text-white/75 text-sm">
                <strong className="text-white font-semibold">{t("teamNoteStrong")}</strong>{" "}
                {t("teamNoteRest")}
              </p>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────── */}
      <section className="bg-surface-inverse py-24">
        <div className="container">
          <SectionHeader eyebrow={t("roadmapEyebrow")} title={t("roadmapTitle")} light className="mb-14" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 divide-white/8">
            {roadmap.map((item) => (
              <MotionItem key={item.id}>
                <div className="border-t-2 border-white/8 hover:border-t-accent pt-6 pb-4 px-0 lg:px-2 transition-colors group">
                  <div className="font-display text-5xl font-extrabold text-white/6 leading-none mb-4 group-hover:text-white/10 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-white mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-white/65 leading-relaxed">{item.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container">
          <MotionDiv>
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-display font-bold text-3xl text-content-strong mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-content-muted mb-8">
                {t("ctaDesc")}
              </p>
              <Button asChild size="lg">
                <Link href="/contact">{t("ctaButton")}</Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
