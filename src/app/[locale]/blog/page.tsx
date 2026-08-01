import type { Metadata } from "next"
import { use } from "react"
import { useFormatter, useTranslations } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { ArrowRight } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { Logo } from "@/components/shared/logo"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"
import { localeUrl } from "@/lib/urls"

/**
 * Post metadata. Titles, excerpts and category labels live in the `blog`
 * message namespace keyed by slug, so posts can be edited and translated
 * without touching this file.
 */
const POSTS = [
  { slug: "building-for-africa", date: "2025-06-15", readMinutes: 5 },
  { slug: "ray-marketplace-vision", date: "2025-05-28", readMinutes: 7 },
  { slug: "mental-wellness-africa", date: "2025-05-10", readMinutes: 6 },
] as const

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blog" })
  const url = localeUrl(locale, "/blog")

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
  }
}

export default function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("blog")
  // Formats dates in the active locale rather than a hardcoded en-US.
  const format = useFormatter()

  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: t("breadcrumb"), href: "/blog" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">{t("eyebrow")}</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h1
              className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              {t("headline")}<br />
              <span className="text-accent">{t("headlineAccent")}</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              {t("sub")}
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── POSTS ────────────────────────────── */}
      <section className="bg-brand-bg py-24">
        <div className="container">
          <MotionList className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {POSTS.map((post) => (
              <MotionItem key={post.slug}>
                <article className="group bg-white rounded-2xl border border-brand-gray-light overflow-hidden hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  <div className="h-48 bg-navy/5 flex items-center justify-center">
                    <Logo alt="" className="h-14 opacity-10" />
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="navy" className="text-[0.6rem]">{t(`posts.${post.slug}.category`)}</Badge>
                      <span className="text-[0.65rem] text-brand-gray">
                        {t("readTime", { minutes: post.readMinutes })}
                      </span>
                    </div>
                    <h2 className="font-display font-bold text-lg text-navy mb-2 group-hover:text-accent transition-colors">
                      {t(`posts.${post.slug}.title`)}
                    </h2>
                    <p className="text-sm text-brand-gray leading-relaxed mb-4 flex-1">
                      {t(`posts.${post.slug}.excerpt`)}
                    </p>
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-brand-gray" dateTime={post.date}>
                        {format.dateTime(new Date(post.date), {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                        {t("read")} <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </article>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-white border-t border-brand-gray-light py-20">
        <div className="container">
          <MotionDiv>
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-4">
                {t("ctaTitle")}
              </h2>
              <p className="text-brand-gray mb-8">
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
