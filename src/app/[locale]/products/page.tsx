import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CheckCircle2, ExternalLink } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { useProducts } from "@/lib/content"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { RaySlideshow } from "@/components/sections/ray-slideshow"
import { DownloadAppMenu } from "@/components/sections/download-app-menu"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeAlternates, localeUrl } from "@/lib/urls"

/** Ids and presentation only — copy lives in the `products` message namespace. */
const RAY_FEATURE_IDS = [
  "quickListings",
  "directConnection",
  "transparentPricing",
  "widerMarket",
  "trustFirst",
  "mobileFirst",
] as const

const RAY_PILLARS = [
  { id: "trust", icon: "🛡" },
  { id: "accessibility", icon: "📱" },
  { id: "speed", icon: "⚡" },
] as const

const HUMURA_TAGS = [
  { id: "safeSpace", pos: "top-4 left-0" },
  { id: "anonymous", pos: "top-4 right-0" },
  { id: "support", pos: "bottom-12 left-0" },
  { id: "wellbeing", pos: "bottom-12 right-0" },
] as const

/** Mini stat pills displayed in the RAY Markets detail section. */
const RAY_MINI_STATS = [
  { icon: "📦", key: "rayStatCategories" },
  { icon: "📍", key: "rayStatLocation" },
  { icon: "📱", key: "rayStatPlatform" },
  { icon: "🆓", key: "rayStatPosting" },
] as const

/** Category chips — emojis are decorative; labels come from i18n. */
const RAY_CATEGORY_KEYS = [
  { emoji: "📱", key: "phones",      slug: "phones" },
  { emoji: "🚗", key: "cars",        slug: "cars" },
  { emoji: "🏠", key: "rentals",     slug: "residential-rentals" },
  { emoji: "💻", key: "electronics", slug: "electronics" },
  { emoji: "🛋", key: "furniture",   slug: "furniture" },
  { emoji: "👗", key: "fashion",     slug: "fashion" },
  { emoji: "💼", key: "jobs",        slug: "jobs" },
  { emoji: "🔧", key: "services",    slug: "services" },
] as const

const RAY_LIVE_URL = "https://www.raymarkets.co/home"

const ECOSYSTEM_NODES = [
  { id: "ray", name: "RAY Markets", active: true },
  { id: "humura", name: "Humura", active: false },
  { id: "more", name: null, active: false },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "products" })
  const path = "/products"
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

export default function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("products")
  const products = useProducts()
  const [ray, humura] = products

  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: t("breadcrumb"), href: "/products" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-surface-inverse py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv><span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{t("eyebrow")}</span></MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("headline")}<br /><span className="text-accent-on-inverse">{t("headlineAccent")}</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              {t("sub")}
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── RAY MARKETS DETAIL ───────────────────────── */}
      <section id="ray-markets" className="bg-surface-raised" aria-labelledby="ray-heading">

        {/* Live announcement bar */}
        <div className="border-b border-accent/20 bg-accent/5">
          <div className="container flex items-center justify-center gap-2.5 py-2.5">
            <span className="relative flex h-2 w-2 shrink-0" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            <span className="text-xs font-medium text-content">{t("rayLiveAnnouncement")}</span>
            <a
              href={RAY_LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-accent hover:underline"
            >
              raymarkets.co →
            </a>
          </div>
        </div>

        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start py-20">
          <MotionDiv>
            {/* Dual badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge>{ray.badge}</Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                ✅ {t("rayLiveBadge")}
              </span>
            </div>

            <h2 id="ray-heading" className="font-display font-extrabold text-content-strong leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              {ray.name}
            </h2>
            <p className="text-accent font-medium mb-4">{ray.tagline}</p>
            <div className="space-y-3 text-content-muted text-sm leading-relaxed mb-7">
              <p>{t("rayIntro1")}</p>
              <p>{t("rayIntro2")}</p>
            </div>

            {/* Mini stats strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-8">
              {RAY_MINI_STATS.map((s) => (
                <div key={s.key} className="flex flex-col items-center gap-1.5 rounded-xl border border-border-subtle bg-surface p-3 text-center">
                  <span className="text-lg" aria-hidden="true">{s.icon}</span>
                  <span className="text-[0.7rem] font-semibold text-content leading-tight">{t(s.key)}</span>
                </div>
              ))}
            </div>

            {/* Three pillars */}
            <div className="flex flex-col gap-3 mb-7">
              {RAY_PILLARS.map((p) => (
                <div key={p.id} className="flex items-start gap-4 p-4 bg-surface rounded-xl border border-border-subtle hover:border-accent transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center text-lg shrink-0" aria-hidden="true">{p.icon}</div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-content-strong mb-0.5">{t(`rayPillars.${p.id}.title`)}</h4>
                    <p className="text-xs text-content-muted">{t(`rayPillars.${p.id}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Category chips */}
            <div className="mb-8">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-content-muted mb-3">
                {t("rayCategoriesLabel")}
              </p>
              <div className="flex flex-wrap gap-2">
                {RAY_CATEGORY_KEYS.map((cat) => (
                  <a
                    key={cat.key}
                    href={`https://www.raymarkets.co/search?category=${cat.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-content hover:border-accent hover:text-accent transition-colors"
                  >
                    <span aria-hidden="true">{cat.emoji}</span>
                    {t(`rayCategoryLabels.${cat.key}`)}
                  </a>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <DownloadAppMenu size="lg" />
              <Button asChild variant="outline-dark" size="lg">
                <a href={RAY_LIVE_URL} target="_blank" rel="noopener noreferrer">
                  {t("visitRayMarkets")}
                  <ExternalLink size={15} className="ml-1.5" aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline-dark" size="lg">
                <Link href="/contact?subject=partnership">{t("rayPartnerCta")}</Link>
              </Button>
            </div>
          </MotionDiv>

          {/* Animated app showcase slideshow */}
          <MotionDiv delay={0.15} className="w-full lg:pt-16">
            <RaySlideshow />
          </MotionDiv>
        </div>
      </section>

      {/* ── RAY MARKETS FEATURES ─────────────────────── */}
      <section className="bg-surface py-20" aria-labelledby="ray-features-heading">
        <div className="container">
          <SectionHeader eyebrow={t("rayFeaturesEyebrow")} title={t("rayFeaturesTitle")} className="mb-12" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RAY_FEATURE_IDS.map((id) => (
              <MotionItem key={id}>
                <div className="bg-surface-raised rounded-xl p-6 border border-border-subtle
                  relative overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-accent group-hover:h-full transition-all duration-300 rounded-bl" />
                  <h4 className="font-display font-bold text-content-strong text-sm mb-2">{t(`rayFeatures.${id}.title`)}</h4>
                  <p className="text-xs text-content-muted leading-relaxed">{t(`rayFeatures.${id}.desc`)}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── HUMURA ───────────────────────────── */}
      <section className="bg-surface py-24" aria-labelledby="humura-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <MotionDiv>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto flex items-center justify-center">
              {["100%", "70%", "40%"].map((size, i) => (
                <div
                  key={size}
                  className={cn(
                    "absolute rounded-full border border-content/8",
                    // Innermost ring carries a faint fill; theme-aware so it
                    // does not vanish against the dark surface.
                    i === 2 && "bg-content/[0.03]"
                  )}
                  style={{ width: size, height: size }}
                />
              ))}
              <div className="flex flex-col items-center gap-1 z-10">
                <span className="text-4xl">🧠</span>
                <span className="font-display text-xl font-extrabold text-content-strong">{humura.name}</span>
                <span className="text-xs text-content-muted uppercase tracking-wider">{t("humuraVisualLabel")}</span>
              </div>
              {HUMURA_TAGS.map((tag) => (
                <span
                  key={tag.id}
                  className={cn("absolute text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full", tag.pos)}
                >
                  {t(`humuraTags.${tag.id}`)}
                </span>
              ))}
            </div>
          </MotionDiv>

          {/* Text */}
          <MotionDiv delay={0.1}>
            <Badge variant="navy" className="mb-5">{humura.badge}</Badge>
            <h2 id="humura-heading" className="font-display font-extrabold text-content-strong leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {humura.name}
            </h2>
            <p className="text-accent font-medium mb-4">{humura.tagline}</p>
            <p className="text-content-muted text-sm leading-relaxed mb-6">
              {t("humuraBlurb")}
            </p>
            <ul className="flex flex-col gap-3 mb-7">
              {humura.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-content">
                  <CheckCircle2 size={16} className="text-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline-dark" size="lg">
              <Link href="/contact?subject=humura">{t("stayUpdated")}</Link>
            </Button>
          </MotionDiv>
        </div>
      </section>

      {/* ── ECOSYSTEM ────────────────────────── */}
      <section className="bg-surface-inverse py-24">
        <div className="container">
          <SectionHeader
            eyebrow={t("ecosystemEyebrow")}
            title={<>{t("ecosystemTitleLine1")}<br />{t("ecosystemTitleLine2")}</>}
            description={t("ecosystemDesc")}
            light
            className="mb-14"
          />
          <MotionDiv>
            <div className="flex flex-col items-center gap-4">
              {/* A 96px circle could not hold a two-line wordmark and a label
                  as well — the mark was cramped and collided with the text
                  under it. The circle now carries the mark alone, at a size
                  where it reads, and the label sits outside it. */}
              <div className="w-28 h-28 rounded-full bg-accent flex items-center justify-center
                shadow-[0_0_60px_rgb(var(--brand-accent)/0.3)]">
                <Logo variant="on-accent" alt="" className="h-10" />
              </div>
              <span className="text-[0.65rem] font-semibold text-white/60 uppercase tracking-[0.2em] mb-2">
                {t("ecosystemBadge")}
              </span>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4">
                {ECOSYSTEM_NODES.map((node) => (
                  <div
                    key={node.id}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 sm:px-6 py-4 rounded-xl border text-center min-w-[100px] sm:min-w-[120px]",
                      node.active
                        ? "border-accent bg-accent/10"
                        : "border-white/8 bg-white/3"
                    )}
                  >
                    <span className="font-display font-bold text-white text-sm">
                      {node.name ?? t("ecosystemNodes.more.name")}
                    </span>
                    <span className="text-[0.65rem] text-white/60 uppercase tracking-wider">
                      {t(`ecosystemNodes.${node.id}.desc`)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-surface-raised border-t border-border-subtle py-20">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-content-strong mb-2">{t("ctaTitle")}</h2>
                <p className="text-content-muted">{t("ctaDesc")}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <DownloadAppMenu size="lg" />
                <Button asChild variant="outline-dark" size="lg">
                  <a href={RAY_LIVE_URL} target="_blank" rel="noopener noreferrer">
                    {t("ctaRay")}
                    <ExternalLink size={15} className="ml-1.5" aria-hidden="true" />
                  </a>
                </Button>
                <Button asChild variant="outline-dark" size="lg">
                  <Link href="/contact?subject=partnership">{t("ctaPartner")}</Link>
                </Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
