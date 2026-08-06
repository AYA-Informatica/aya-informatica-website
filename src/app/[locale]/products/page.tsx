import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import {
  Brain, Briefcase, Car, CheckCircle2, ExternalLink, Home, Laptop, LayoutGrid,
  Flame, MapPin, Shirt, ShieldCheck, Smartphone, Sofa, Sparkles, Tag, Wrench, Zap,
} from "lucide-react"
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

/**
 * Emoji were doing this job. They render differently on every platform, so the
 * page looked different depending on the visitor's OS, and at 16px inside a
 * rounded square they read as broken images rather than icons. Lucide is
 * already a dependency and is used everywhere else on the site.
 */
const RAY_PILLARS = [
  { id: "trust", Icon: ShieldCheck },
  { id: "accessibility", Icon: Smartphone },
  { id: "speed", Icon: Zap },
] as const

const HUMURA_TAGS = [
  { id: "safeSpace" },
  { id: "anonymous" },
  { id: "support" },
  { id: "wellbeing" },
] as const

/** Four facts about RAY, shown as an inline row rather than as boxes. */
const RAY_MINI_STATS = [
  { Icon: LayoutGrid, key: "rayStatCategories" },
  { Icon: MapPin, key: "rayStatLocation" },
  { Icon: Smartphone, key: "rayStatPlatform" },
  { Icon: Tag, key: "rayStatPosting" },
] as const

/** Category chips — emojis are decorative; labels come from i18n. */
const RAY_CATEGORY_KEYS = [
  { Icon: Smartphone, key: "phones",      slug: "phones" },
  { Icon: Car,        key: "cars",        slug: "cars" },
  { Icon: Home,       key: "rentals",     slug: "residential-rentals" },
  { Icon: Laptop,     key: "electronics", slug: "electronics" },
  { Icon: Sofa,       key: "furniture",   slug: "furniture" },
  { Icon: Shirt,      key: "fashion",     slug: "fashion" },
  { Icon: Briefcase,  key: "jobs",        slug: "jobs" },
  { Icon: Wrench,     key: "services",    slug: "services" },
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
              <Badge className="gap-1.5">
                <Flame size={13} aria-hidden="true" />
                {ray.badge}
              </Badge>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-700 dark:text-green-400">
                <CheckCircle2 size={13} aria-hidden="true" />
                {t("rayLiveBadge")}
              </span>
            </div>

            {/* Was clamp(3rem, 6vw, 5rem), which broke "RAY Markets" across two
                lines at every desktop width and shouted over its own tagline.
                Capped so the name sits on one line and the sentence under it
                can be read as the more important of the two. */}
            <h2 id="ray-heading" className="font-display font-extrabold text-content-strong leading-[1.05] tracking-tight mb-3"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)" }}
            >
              {ray.name}
            </h2>
            <p className="text-accent font-medium text-lg mb-4">{ray.tagline}</p>
            <div className="space-y-3 text-content-muted text-sm leading-relaxed mb-7">
              <p>{t("rayIntro1")}</p>
              <p>{t("rayIntro2")}</p>
            </div>

            {/* Facts, as an inline row.
                These were boxes, directly above three more boxes and eight
                pills — the same rhythm three times running, so nothing led and
                the pillars read as list rows rather than as the reasons to care.
                Stripping the boxes here leaves one rhythm per band: a quiet
                line of facts, then cards, then pills. */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8 pb-7 border-b border-border-subtle">
              {RAY_MINI_STATS.map(({ Icon, key }) => (
                <span key={key} className="inline-flex items-center gap-1.5 text-xs font-medium text-content-muted">
                  <Icon size={14} className="text-accent shrink-0" aria-hidden="true" />
                  {t(key)}
                </span>
              ))}
            </div>

            {/* Three pillars — now the only carded rhythm in the column. */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {RAY_PILLARS.map(({ id, Icon }) => (
                <div key={id} className="p-4 bg-surface rounded-xl border border-border-subtle hover:border-accent transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-3">
                    <Icon size={17} aria-hidden="true" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-content-strong mb-1">{t(`rayPillars.${id}.title`)}</h4>
                  <p className="text-xs text-content-muted leading-relaxed">{t(`rayPillars.${id}.desc`)}</p>
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
                    className="group inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-surface px-3 py-1.5 text-xs font-medium text-content hover:border-accent hover:text-accent transition-colors"
                  >
                    <cat.Icon
                      size={13}
                      className="text-content-muted group-hover:text-accent transition-colors shrink-0"
                      aria-hidden="true"
                    />
                    {t(`rayCategoryLabels.${cat.key}`)}
                  </a>
                ))}
              </div>
            </div>

            {/* One primary action.
                There were three buttons of near-equal weight here, which asked
                the visitor to choose rather than telling them what to do, and
                stacked into three near-identical blocks on a phone. Downloading
                the app is the only one of the three that cannot be done from
                anywhere else on the site, so it is the button; visiting the web
                app is a link beside it. "Partner With Us" is gone — it is
                already a button in the navbar, a few inches above this. */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              <DownloadAppMenu size="lg" />
              <a
                href={RAY_LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline underline-offset-4"
              >
                {t("visitRayMarkets")}
                <ExternalLink size={14} aria-hidden="true" />
              </a>
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
          {/* Visual.
              RAY arrives with a real screenshot, four facts, three pillars and
              eight categories. Humura has not shipped, so there is nothing
              truthful to put here of that weight, and the previous version —
              hairline rings around an emoji, adrift in a large empty column —
              read as a section someone ran out of time on rather than as a
              product that is deliberately still ahead.

              So it commits to being a mark rather than pretending to be a
              screenshot: a filled panel with the rings inside it, sized to hold
              the column, with the four qualities anchored along the bottom
              instead of floating at the corners. Restrained on purpose, but
              finished. */}
          <MotionDiv>
            <div className="relative rounded-3xl border border-border-subtle bg-surface-raised px-6 py-12 sm:py-16 overflow-hidden">
              {/* A single soft accent wash, so the panel is not flat grey. */}
              <div
                aria-hidden="true"
                className="absolute -top-24 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgb(var(--brand-accent) / 0.10) 0%, transparent 70%)" }}
              />

              <div className="relative flex flex-col items-center">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 flex items-center justify-center">
                  {["100%", "72%", "44%"].map((size, i) => (
                    <div
                      key={size}
                      className={cn(
                        "absolute rounded-full border",
                        // Stepped rather than uniform, so the rings read as
                        // depth rather than as three identical circles.
                        i === 0 && "border-content/10",
                        i === 1 && "border-content/[0.14]",
                        i === 2 && "border-accent/30 bg-accent/5"
                      )}
                      style={{ width: size, height: size }}
                    />
                  ))}
                  {/* Only the mark sits inside the rings. With the name and
                      label in here too, the text ran wider than the inner ring
                      and crossed the one outside it. */}
                  <span className="z-10 w-14 h-14 rounded-2xl bg-accent/12 text-accent flex items-center justify-center">
                    <Brain size={26} aria-hidden="true" />
                  </span>
                </div>

                <div className="flex flex-col items-center gap-1 mt-6">
                  <span className="font-display text-2xl font-extrabold text-content-strong">{humura.name}</span>
                  <span className="text-[0.65rem] text-content-muted uppercase tracking-[0.18em]">
                    {t("humuraVisualLabel")}
                  </span>
                </div>

                {/* Anchored, not floating. As absolutely-positioned corner tags
                    these collided with the rings at some widths and had no
                    relationship to anything. */}
                <div className="flex flex-wrap justify-center gap-2 mt-8">
                  {HUMURA_TAGS.map((tag) => (
                    <span
                      key={tag.id}
                      className="text-xs font-medium text-accent bg-accent/10 border border-accent/20 px-3 py-1.5 rounded-full"
                    >
                      {t(`humuraTags.${tag.id}`)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </MotionDiv>

          {/* Text */}
          <MotionDiv delay={0.1}>
            <Badge variant="navy" className="gap-1.5 mb-5">
              <Sparkles size={13} aria-hidden="true" />
              {humura.badge}
            </Badge>
            <h2 id="humura-heading" className="font-display font-extrabold text-content-strong leading-[1.05] tracking-tight mb-3"
              style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.25rem)" }}
            >
              {humura.name}
            </h2>
            <p className="text-accent font-medium text-lg mb-4">{humura.tagline}</p>
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
