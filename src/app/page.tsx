import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { STATS, PRODUCTS, APPROACH, TESTIMONIALS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const metadata: Metadata = {
  title: "AYA Informatica – Building Africa's Digital Future",
  description:
    "AYA Informatica designs and deploys innovative platforms that simplify commerce, enhance human connection, and unlock economic opportunity across Africa.",
}

export default function HomePage() {
  return (
    <PageWrapper>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section
        className="relative min-h-screen -mt-[var(--navbar-height)] pt-[var(--navbar-height)] bg-navy flex flex-col justify-center overflow-hidden"
        aria-label="Hero"
      >
        {/* Background grid */}
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        {/* Glow orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(10,132,255,0.1) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(10,132,255,0.06) 0%, transparent 70%)" }}
        />

        <div className="container relative z-10 py-12 sm:py-16 md:py-20">
          {/* Eyebrow badge */}
          <MotionDiv delay={0}>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/6 border border-white/10 px-4 py-2 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
              <span className="text-xs text-white/55 tracking-wide">
                Kigali, Rwanda — Building For Africa
              </span>
            </div>
          </MotionDiv>

          {/* Headline */}
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-[1.05] tracking-tight mb-6"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              Building Africa&apos;s<br />
              <span className="text-accent">Digital Future</span>
            </h1>
          </MotionDiv>

          {/* Sub */}
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
              AYA Informatica designs and deploys innovative platforms that simplify
              commerce, enhance human connection, and unlock economic opportunity
              across the continent.
            </p>
          </MotionDiv>

          {/* CTAs */}
          <MotionDiv delay={0.3}>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/products">
                  Explore Our Products
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/about">Learn Our Story</Link>
              </Button>
            </div>
          </MotionDiv>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25" aria-hidden="true">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/30 animate-scroll-line" />
          <span className="text-[0.6rem] uppercase tracking-widest">Scroll</span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════ */}
      <section className="bg-white border-b border-brand-gray-light" aria-label="Company highlights">
        <div className="container py-10">
          <MotionList className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <MotionItem key={stat.label} className="flex flex-col items-center text-center gap-1 py-3 px-2">
                <span className="font-display font-extrabold text-navy leading-none"
                  style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
                >
                  {stat.value}
                </span>
                <span className="text-[0.7rem] text-brand-gray uppercase tracking-wider font-medium">
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
      <section className="bg-brand-bg py-24" aria-labelledby="pillars-heading">
        <div className="container">
          <SectionHeader
            eyebrow="What We Do"
            title={<>Three Pillars.<br />One Mission.</>}
            description="We operate at the intersection of commerce, technology, and human experience — building systems designed to grow with Africa."
            className="mb-14"
          />

          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pillars.map((p) => (
              <MotionItem key={p.title}>
                <Link
                  href={p.href}
                  className="group block bg-white rounded-2xl p-7 border border-brand-gray-light
                    hover:border-accent hover:shadow-card-hover hover:-translate-y-1
                    transition-all duration-300 h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-navy/8 flex items-center justify-center text-navy
                    group-hover:bg-accent/12 group-hover:text-accent transition-colors duration-200 mb-5"
                  >
                    {p.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy mb-2">{p.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed mb-4">{p.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                    Learn more <ArrowRight size={14} />
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
      <section className="bg-navy py-24" aria-labelledby="products-preview-heading">
        <div className="container">
          <SectionHeader
            eyebrow="Our Products"
            title={<>Platforms Built<br />for Real People</>}
            light
            className="mb-14"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {PRODUCTS.map((product, i) => (
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
                        "bg-white text-accent border-transparent hover:bg-white/90 hover:text-accent shadow-none"
                    )}
                    size="sm"
                  >
                    <Link href="/products">
                      {product.status === "active" ? "Discover RAY" : "Learn More"}
                    </Link>
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
      <section className="bg-brand-bg py-24" aria-labelledby="approach-heading">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <SectionHeader
              eyebrow="Our Approach"
              title="How We Build"
              description="Every product we ship follows a disciplined philosophy — designed for real people, built to scale, and grounded in trust."
            />
            <MotionList className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {APPROACH.map((item) => (
                <MotionItem key={item.num}>
                  <div className="bg-white rounded-xl p-6 border border-brand-gray-light hover:border-accent transition-colors duration-200">
                    <span className="font-display text-3xl font-extrabold text-navy/8 leading-none block mb-3">
                      {item.num}
                    </span>
                    <h4 className="font-display font-bold text-base text-navy mb-2">{item.title}</h4>
                    <p className="text-sm text-brand-gray leading-relaxed">{item.desc}</p>
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
      <section className="bg-navy py-24" aria-labelledby="testimonials-heading">
        <div className="container">
          <SectionHeader
            eyebrow="What People Say"
            title="Trusted by Builders"
            light
            className="mb-14"
          />
          <MotionList className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
            {TESTIMONIALS.map((t) => (
              <MotionItem key={t.name}>
                <div className="bg-white/5 border border-white/8 rounded-2xl p-7 h-full flex flex-col">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-accent mb-4 shrink-0" aria-hidden="true">
                    <path d="M11 7H7a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H5.5A2.5 2.5 0 0 1 8 7.5V7h3V7ZM21 7h-4a4 4 0 0 0-4 4v1a3 3 0 0 0 3 3h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1.5A2.5 2.5 0 0 1 18 7.5V7h3V7Z" fill="currentColor" />
                  </svg>
                  <blockquote className="text-sm text-white/70 leading-relaxed mb-5 flex-1">
                    {t.quote}
                  </blockquote>
                  <div>
                    <div className="font-display font-semibold text-sm text-white">{t.name}</div>
                    <div className="text-xs text-white/40">{t.role}</div>
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
      <section className="bg-white border-t border-brand-gray-light py-20">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">
                  Ready to Build the Future Together?
                </h2>
                <p className="text-brand-gray">
                  Partner with AYA Informatica to create the digital infrastructure Africa deserves.
                </p>
              </div>
              <div className="flex gap-3 shrink-0 flex-wrap">
                <Button asChild size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button asChild variant="outline-dark" size="lg">
                  <Link href="/products">See Our Products</Link>
                </Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}

/* ── Pillars data (local, icons as JSX) ───────────────── */
const pillars = [
  {
    title: "Platform Development",
    href: "/services#svc-platform",
    desc: "Scalable digital platforms that connect users, facilitate transactions, and enable new forms of economic activity.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="16" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <rect x="2" y="16" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M16 21h6M21 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Intelligent Systems",
    href: "/services#svc-intelligent",
    desc: "Systems that leverage data and modern technologies to improve efficiency, decision-making, and user experience.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
        <path d="M9 14l3.5 3.5L19 10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Digital Solutions",
    href: "/services#svc-solutions",
    desc: "Tailored software solutions for businesses seeking to modernize and scale their operations across Africa.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <path d="M4 22V10l10-6 10 6v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <rect x="10" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
]
