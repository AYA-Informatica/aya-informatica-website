import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import {
  useApproach,
  usePillars,
  useProducts,
  useStats,
  useTestimonials,
} from "@/lib/content"
import { PILLAR_ICONS } from "@/components/shared/pillar-icons"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "home" })
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  }
}

export default function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // `params` is a Promise in Next 16. Unwrapping with `use()` rather than
  // making the component async keeps it synchronous, which is required for the
  // `useTranslations` / content hooks below.
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("home")
  const stats = useStats()
  const products = useProducts()
  const approach = useApproach()
  const testimonials = useTestimonials()
  const pillars = usePillars()

  return (
    <PageWrapper>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-screen -mt-[var(--navbar-height)] pt-[var(--navbar-height)] bg-surface-inverse flex flex-col justify-center overflow-hidden"
        aria-label={t("heroAriaLabel")}
      >
        {/* Background grid */}
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        {/* Glow orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,155,255,0.1) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,155,255,0.06) 0%, transparent 70%)" }}
        />

        <div className="container relative z-10 py-12 sm:py-16 md:py-20">
          {/* Eyebrow badge */}
          <MotionDiv delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 border border-white/10 px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-xs text-white/55 tracking-wide">
                {t("badge")}
              </span>
            </div>
          </MotionDiv>

          {/* Headline */}
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {t("headline")}<br />
              <span className="text-accent-on-inverse">{t("headlineAccent")}</span>
            </h1>
          </MotionDiv>

          {/* Sub */}
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
              {t("sub")}
            </p>
          </MotionDiv>

          {/* CTAs */}
          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  {t("ctaProducts")}
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">{t("ctaStory")}</Link>
              </Button>
            </div>
          </MotionDiv>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25" aria-hidden="true">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30 animate-scroll-line" />
          <span className="text-[0.6rem] uppercase tracking-widest">{t("scroll")}</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section className="bg-surface-raised border-b border-border-subtle" aria-label={t("statsAriaLabel")}>
        <div className="container py-10">
          <MotionList className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <MotionItem key={stat.id} className="flex flex-col items-center text-center gap-1 py-3 px-2">
                <span className="font-display font-extrabold text-content-strong leading-none"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  {stat.value}
                </span>
                <span className="text-[0.7rem] text-content-muted uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ════════════════════════════════════════
          THREE PILLARS
      ════════════════════════════════════════ */}
      <section className="bg-surface py-24" aria-labelledby="pillars-heading">
        <div className="container">
          <SectionHeader
            eyebrow={t("pillarsEyebrow")}
            title={<>{t("pillarsTitleLine1")}<br />{t("pillarsTitleLine2")}</>}
            description={t("pillarsDesc")}
            className="mb-14"
          />

          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <MotionItem key={p.id}>
                <Link
                  href={p.href}
                  className="group block bg-surface-raised rounded-2xl p-7 border border-border-subtle
                    hover:border-accent hover:shadow-card-hover hover:-translate-y-1
                    transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-content/8 flex items-center justify-center text-content-strong
                    group-hover:bg-accent/12 group-hover:text-accent transition-colors duration-200 mb-5"
                  >
                    {PILLAR_ICONS[p.id]}
                  </div>
                  <h3 className="font-display font-bold text-lg text-content-strong mb-2">{p.title}</h3>
                  <p className="text-sm text-content-muted leading-relaxed mb-4">{p.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                    {t("learnMore")} <ArrowRight size={14} />
                  </span>
                </Link>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PRODUCTS PREVIEW
      ════════════════════════════════════════ */}
      <section className="bg-surface-inverse py-24" aria-labelledby="products-preview-heading">
        <div className="container">
          <SectionHeader
            eyebrow={t("productsEyebrow")}
            title={<>{t("productsTitleLine1")}<br />{t("productsTitleLine2")}</>}
            light
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {products.map((product, i) => (
              <MotionDiv key={product.id} delay={i * 0.1}>
                <div
                  className={cn(
                    "rounded-2xl p-8 h-full flex flex-col",
                    product.status === "active"
                      ? "bg-accent"
                      : "bg-white/5 border border-white/10"
                  )}
                >
                  <Badge
                    variant="outline"
                    className="self-start mb-4 text-[0.65rem]"
                  >
                    {product.badge}
                  </Badge>
                  <h3 className="font-display font-extrabold text-white leading-none tracking-tight mb-3"
                    style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                  >
                    {product.name}
                  </h3>
                  <p className="text-white/75 text-sm leading-relaxed mb-5 flex-1">
                    {product.description}
                  </p>
                  <ul className="flex flex-col gap-2 mb-6">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-white/70">
                        <span className="w-1 h-1 rounded-full bg-white/50 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className={cn(
                      "self-start",
                      product.status === "active" &&
                        "bg-surface-raised text-accent border-transparent hover:bg-white/90 hover:text-accent shadow-none"
                    )}
                    size="sm"
                  >
                    <Link href="/products">{product.cta}</Link>
                  </Button>
                </div>
              </MotionDiv>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          APPROACH
      ════════════════════════════════════════ */}
      <section className="bg-surface py-24" aria-labelledby="approach-heading">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <SectionHeader
              eyebrow={t("approachEyebrow")}
              title={t("approachTitle")}
              description={t("approachDesc")}
            />
            <MotionList className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {approach.map((item) => (
                <MotionItem key={item.id}>
                  <div className="bg-surface-raised rounded-xl p-6 border border-border-subtle hover:border-accent transition-colors duration-200">
                    <span className="font-display text-3xl font-extrabold text-content-strong/8 leading-none block mb-3">
                      {item.num}
                    </span>
                    <h4 className="font-display font-bold text-base text-content-strong mb-2">{item.title}</h4>
                    <p className="text-sm text-content-muted leading-relaxed">{item.desc}</p>
                  </div>
                </MotionItem>
              ))}
            </MotionList>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          TESTIMONIALS
      ════════════════════════════════════════ */}
      <section className="bg-surface-inverse py-24" aria-labelledby="testimonials-heading">
        <div className="container">
          <SectionHeader
            eyebrow={t("testimonialsEyebrow")}
            title={t("testimonialsTitle")}
            light
            className="mb-14"
          />
          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {testimonials.map((item) => (
              <MotionItem key={item.id}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-7 h-full flex flex-col">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent-on-inverse mb-4 shrink-0" aria-hidden="true">
                    <path d="M11 7H7a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 1 8 7.5V7h3V7ZM21 7h-4a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1.5A2.5 2.5 0 0 1 18 7.5V7h3V7Z" fill="currentColor" />
                  </svg>
                  <blockquote className="text-sm text-white/70 leading-relaxed mb-5 flex-1">
                    {item.quote}
                  </blockquote>
                  <div>
                    <div className="font-display font-semibold text-sm text-white">{item.name}</div>
                    <div className="text-xs text-white/60">{item.role}</div>
                  </div>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA BANNER
      ════════════════════════════════════════ */}
      <section className="bg-surface-raised border-t border-border-subtle py-20">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-content-strong mb-2">
                  {t("ctaTitle")}
                </h2>
                <p className="text-content-muted">
                  {t("ctaDesc")}
                </p>
              </div>
              <div className="flex gap-3 shrink-0 flex-wrap">
                <Button asChild size="lg">
                  <Link href="/contact">{t("ctaButton")}</Link>
                </Button>
                <Button asChild variant="outline-dark" size="lg">
                  <Link href="/products">{t("ctaProducts2")}</Link>
                </Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
