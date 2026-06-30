import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { ROADMAP } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "About",
  description:
    "AYA Informatica is led by a focused team of builders, engineers, and thinkers committed to creating impactful digital products across Africa.",
  alternates: { canonical: "https://ayainformatica.tech/about" },
  openGraph: {
    title: "About AYA Informatica – Builders of Africa's Digital Future",
    description: "Meet the team behind AYA Informatica. Rwanda-based builders, engineers, and thinkers committed to Africa's digital transformation.",
    url: "https://ayainformatica.tech/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "About AYA Informatica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "About AYA Informatica",
    description: "Rwanda-based builders, engineers, and thinkers committed to Africa's digital transformation.",
  },
}

export default function AboutPage() {
  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: "About", href: "/about" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv delay={0}>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Our Story</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Built From Rwanda.<br />
              <span className="text-accent">For Africa.</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              We are a focused team of builders, engineers, and thinkers committed to
              creating impactful digital products that change how Africa lives,
              trades, and connects.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── OVERVIEW ─────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <MotionDiv>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-accent block mb-3">Company Overview</span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-navy mb-6">
              More Than Apps.<br />Digital Infrastructure.
            </h2>
            <div className="space-y-4 text-brand-gray leading-relaxed">
              <p>
                AYA Informatica is a Rwanda-based technology company focused on building
                scalable digital platforms that connect people, businesses, and opportunities
                across Africa.
              </p>
              <p>
                We take a product-first approach to solving real-world challenges, designing
                systems that are simple, reliable, and built for everyday use. Our work sits at
                the intersection of commerce, technology, and human experience.
              </p>
              <p>
                At AYA Informatica, we are not just building applications — we are building the
                digital infrastructure for how people live, trade, and interact in the modern
                African economy.
              </p>
            </div>
          </MotionDiv>

          <MotionDiv delay={0.15}>
            <div className="bg-navy rounded-2xl overflow-hidden">
              <div className="grid grid-cols-2 border-b border-white/6 divide-x divide-white/6">
                {[
                  { num: "2024", label: "Founded in Kigali" },
                  { num: "2", label: "Platforms in Development" },
                ].map((s) => (
                  <div key={s.num} className="p-6 odd:border-r odd:border-white/6">
                    <div className="font-display text-3xl font-extrabold text-white mb-1">{s.num}</div>
                    <div className="text-xs text-white/40 leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="p-6">
                <blockquote className="font-display text-base font-semibold italic text-white/80 leading-relaxed mb-3">
                  &ldquo;We are building for the future — but grounded in the needs of today.&rdquo;
                </blockquote>
                <cite className="text-xs text-white/30 not-italic">— AYA Informatica</cite>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── VISION & MISSION ─────────────────── */}
      <section className="bg-brand-bg py-24">
        <div className="container">
          <SectionHeader eyebrow="Vision & Mission" title="Why We Exist" className="mb-14" />
          <MotionList className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {[
              {
                type: "Vision",
                isVision: true,
                title: "Africa's Leading Builder of Digital Ecosystems",
                desc: "To become Africa's leading builder of digital ecosystems that power everyday life — from commerce to connection, from health to wellness.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="6" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.34 6.34l2.83 2.83M22.83 22.83l2.83 2.83M6.34 25.66l2.83-2.83M22.83 9.17l2.83-2.83" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
              },
              {
                type: "Mission",
                isVision: false,
                title: "Design Platforms. Simplify Commerce. Connect Africa.",
                desc: "To design and deploy innovative platforms that simplify commerce, enhance human connection, and unlock economic opportunities across the continent.",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M16 4v18M4 10l12 6 12-6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                  </svg>
                ),
              },
            ].map((card) => (
              <MotionItem key={card.type}>
                <div className={cn("bg-white rounded-2xl p-8 border border-brand-gray-light border-t-[3px] h-full hover:shadow-card-hover transition-shadow", card.isVision ? "border-t-accent" : "border-t-navy")}>
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-5", card.isVision ? "bg-accent/10 text-accent" : "bg-navy/8 text-navy")}>
                    {card.icon}
                  </div>
                  <span className={cn("text-xs font-semibold uppercase tracking-[0.1em] block mb-3", card.isVision ? "text-accent" : "text-navy")}>
                    {card.type}
                  </span>
                  <h3 className="font-display font-bold text-xl text-navy mb-3">{card.title}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{card.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────── */}
      <section className="bg-white py-24">
        <div className="container">
          <SectionHeader
            eyebrow="Our Team"
            title={<>Builders. Engineers.<br />Thinkers.</>}
            description="AYA Informatica is led by a focused team committed to creating impactful digital products. We operate lean, fast, and with clarity."
            className="mb-14"
          />
          <MotionList className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-6">
            {[
              {
                role: "Founder & CEO",
                desc: "Vision, product strategy, and growth. The driving force behind AYA Informatica's mission to build Africa's digital infrastructure.",
                icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true"><circle cx="18" cy="12" r="7" stroke="currentColor" strokeWidth="2"/><path d="M4 32c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
              },
              {
                role: "Development Team",
                desc: "Responsible for building scalable, efficient systems. The engineers who turn vision into working digital reality.",
                icon: <svg width="28" height="28" viewBox="0 0 36 36" fill="none" aria-hidden="true"><rect x="4" y="6" width="28" height="22" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M12 16l-4 4 4 4M24 16l4 4-4 4M17 14l2 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
              },
            ].map((member) => (
              <MotionItem key={member.role}>
                <div className="bg-brand-bg rounded-2xl p-7 border border-brand-gray-light hover:border-accent transition-colors">
                  <div className="w-14 h-14 rounded-xl bg-navy/8 flex items-center justify-center text-navy mb-5">
                    {member.icon}
                  </div>
                  <h3 className="font-display font-bold text-lg text-navy mb-2">{member.role}</h3>
                  <p className="text-sm text-brand-gray leading-relaxed">{member.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
          <MotionDiv>
            <div className="bg-navy rounded-xl px-8 py-5 text-center">
              <p className="text-white/75 text-sm">
                <strong className="text-white font-semibold">We operate lean, fast, and with clarity.</strong>{" "}
                Small team, big ambitions, disciplined execution.
              </p>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── ROADMAP ──────────────────────────── */}
      <section className="bg-navy py-24">
        <div className="container">
          <SectionHeader eyebrow="Our Roadmap" title="The Path Ahead" light className="mb-14" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 divide-y sm:divide-y-0 divide-white/8">
            {ROADMAP.map((item, i) => (
              <MotionItem key={item.step}>
                <div className="border-t-2 border-white/8 hover:border-t-accent pt-6 pb-4 px-0 lg:px-2 transition-colors group">
                  <div className="font-display text-5xl font-extrabold text-white/6 leading-none mb-4 group-hover:text-white/10 transition-colors">
                    {item.step}
                  </div>
                  <h3 className="font-display font-semibold text-sm text-white mb-2 leading-snug">{item.title}</h3>
                  <p className="text-xs text-white/45 leading-relaxed">{item.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────── */}
      <section className="bg-brand-bg py-20">
        <div className="container">
          <MotionDiv>
            <div className="text-center max-w-lg mx-auto">
              <h2 className="font-display font-bold text-3xl text-navy mb-4">
                Join Us in Building Africa&apos;s Digital Future
              </h2>
              <p className="text-brand-gray mb-8">
                Whether you want to partner, invest, or collaborate — we want to hear from you.
              </p>
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
