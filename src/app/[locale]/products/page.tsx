import type { Metadata } from "next"
import { use } from "react"
import { useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { CheckCircle2 } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { useProducts } from "@/lib/content"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/shared/logo"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeUrl } from "@/lib/urls"

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

/** Illustrative listings for the phone mockup — product names are proper nouns. */
const MOCKUP_LISTINGS = [
  { name: "iPhone 14 Pro", price: "RWF 850,000" },
  { name: "Samsung S23", price: "RWF 620,000" },
  { name: "Tecno Camon 20", price: "RWF 185,000" },
] as const

const ECOSYSTEM_NODES = [
  { id: "ray", name: "RAY", active: true },
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
  const url = localeUrl(locale, "/products")

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

      {/* ── RAY DETAIL ───────────────────────── */}
      <section className="bg-white py-24" aria-labelledby="ray-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <MotionDiv>
            <Badge className="mb-5">{ray.badge}</Badge>
            <h2 id="ray-heading" className="font-display font-extrabold text-navy leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              {ray.name}
            </h2>
            <p className="text-accent font-medium mb-4">{ray.tagline}</p>
            <div className="space-y-3 text-brand-gray text-sm leading-relaxed mb-7">
              <p>{t("rayIntro1")}</p>
              <p>{t("rayIntro2")}</p>
            </div>

            {/* Three pillars */}
            <div className="flex flex-col gap-3 mb-7">
              {RAY_PILLARS.map((p) => (
                <div key={p.id} className="flex items-start gap-4 p-4 bg-brand-bg rounded-xl border border-brand-gray-light hover:border-accent transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shrink-0">{p.icon}</div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy mb-0.5">{t(`rayPillars.${p.id}.title`)}</h4>
                    <p className="text-xs text-brand-gray">{t(`rayPillars.${p.id}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link href="/contact?subject=ray-access">{t("getEarlyAccess")}</Link>
            </Button>
          </MotionDiv>

          {/* Phone mockup */}
          <MotionDiv delay={0.15}>
            <div className="bg-navy rounded-3xl p-5 sm:p-6 shadow-[0_40px_80px_rgba(0,21,41,0.25)] max-w-[260px] sm:max-w-[300px] mx-auto w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-display text-xl font-extrabold text-white">RAY</span>
                <span className="text-xs text-white/40">{t("mockupLocation")}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/7 rounded-lg px-3 py-2.5 mb-4">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white/40" aria-hidden="true">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-xs text-white/35">{t("mockupSearch")}</span>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                {MOCKUP_LISTINGS.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5">
                    <div className="w-9 h-9 rounded-md bg-gradient-to-br from-accent/30 to-white/10 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[0.65rem] text-accent">{item.price}</div>
                      <div className="text-[0.6rem] text-white/35">{t("mockupVerified")}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-accent rounded-lg py-2.5 text-center text-xs font-semibold text-white">
                {t("mockupPostItem")}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── RAY FEATURES ─────────────────────── */}
      <section className="bg-brand-bg py-20" aria-labelledby="ray-features-heading">
        <div className="container">
          <SectionHeader eyebrow={t("rayFeaturesEyebrow")} title={t("rayFeaturesTitle")} className="mb-12" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RAY_FEATURE_IDS.map((id) => (
              <MotionItem key={id}>
                <div className="bg-white rounded-xl p-6 border border-brand-gray-light
                  relative overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-accent group-hover:h-full transition-all duration-300 rounded-bl" />
                  <h4 className="font-display font-bold text-navy text-sm mb-2">{t(`rayFeatures.${id}.title`)}</h4>
                  <p className="text-xs text-brand-gray leading-relaxed">{t(`rayFeatures.${id}.desc`)}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── HUMURA ───────────────────────────── */}
      <section className="bg-brand-bg py-24" aria-labelledby="humura-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <MotionDiv>
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 mx-auto flex items-center justify-center">
              {["100%", "70%", "40%"].map((size, i) => (
                <div
                  key={size}
                  className="absolute rounded-full border border-navy/8"
                  style={{ width: size, height: size, background: i === 2 ? "rgba(0,21,41,0.03)" : "transparent" }}
                />
              ))}
              <div className="flex flex-col items-center gap-1 z-10">
                <span className="text-4xl">🧠</span>
                <span className="font-display text-xl font-extrabold text-navy">{humura.name}</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">{t("humuraVisualLabel")}</span>
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
            <h2 id="humura-heading" className="font-display font-extrabold text-navy leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              {humura.name}
            </h2>
            <p className="text-accent font-medium mb-4">{humura.tagline}</p>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              {t("humuraBlurb")}
            </p>
            <ul className="flex flex-col gap-3 mb-7">
              {humura.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-brand-dark">
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
      <section className="bg-navy py-24">
        <div className="container">
          <SectionHeader
            eyebrow={t("ecosystemEyebrow")}
            title={<>{t("ecosystemTitleLine1")}<br />{t("ecosystemTitleLine2")}</>}
            description={t("ecosystemDesc")}
            light
            className="mb-14"
          />
          <MotionDiv>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-accent flex flex-col items-center justify-center
                shadow-[0_0_60px_rgba(10,132,255,0.3)]">
                <Logo variant="white" alt="" className="h-7" />
                <span className="text-[0.55rem] text-white/65 uppercase tracking-wider mt-1">{t("ecosystemBadge")}</span>
              </div>
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
                    <span className="text-[0.65rem] text-white/40 uppercase tracking-wider">
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
      <section className="bg-white border-t border-brand-gray-light py-20">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">{t("ctaTitle")}</h2>
                <p className="text-brand-gray">{t("ctaDesc")}</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button asChild size="lg"><Link href="/contact">{t("ctaContact")}</Link></Button>
                <Button asChild variant="outline-dark" size="lg"><Link href="/services">{t("ctaServices")}</Link></Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
