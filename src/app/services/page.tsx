import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { SERVICES } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const metadata: Metadata = {
  title: "Services",
  description:
    "Platform development, intelligent systems, and digital solutions. AYA Informatica brings the technical depth your business needs to grow.",
  alternates: { canonical: "https://ayainformatica.com/services" },
  openGraph: {
    title: "AYA Informatica Services – Platform Development & Digital Solutions",
    description: "End-to-end platform development, intelligent systems, and tailored digital solutions for businesses across Africa.",
    url: "https://ayainformatica.com/services",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AYA Informatica Services" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AYA Informatica Services",
    description: "Platform development, intelligent systems, and digital solutions for Africa.",
  },
}

const WHY = [
  { title: "Deep Local Market Knowledge", desc: "Based in Kigali, we understand the realities of building for African markets — infrastructure, user behavior, and business dynamics." },
  { title: "Mobile-First by Default", desc: "Everything we build is designed for mobile-first use, because that's how most of Africa accesses digital services." },
  { title: "Product-Driven Thinking", desc: "We think like product builders, not just developers — ensuring what we build serves real user needs and business goals." },
  { title: "Trust-First Architecture", desc: "Trust, safety, and reliability are core design principles from day one — not afterthoughts." },
]

const PROCESS = [
  { step: "01", title: "Discover", desc: "We start by understanding your business, users, and the problem you're solving." },
  { step: "02", title: "Design", desc: "We architect a solution that is user-centered, scalable, and grounded in your context." },
  { step: "03", title: "Build", desc: "We develop fast and iteratively, keeping you involved and shipping real progress continuously." },
  { step: "04", title: "Scale", desc: "We deploy, monitor, and optimize — ensuring your platform grows as your business grows." },
]

export default function ServicesPage() {
  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[72px] pt-[calc(72px+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv><span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Our Services</span></MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              We Build.<br /><span className="text-accent">You Scale.</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              From scalable platforms to intelligent systems and custom digital solutions —
              AYA Informatica brings the technical depth and product thinking your business needs.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── SERVICES ─────────────────────────── */}
      {SERVICES.map((svc, i) => (
        <section
          key={svc.id}
          id={`svc-${svc.id}`}
          className={cn("py-20 border-b border-brand-gray-light scroll-mt-20", i % 2 === 0 ? "bg-white" : "bg-brand-bg")}
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
                <Link href={`/contact?subject=services`}>Discuss Your Project</Link>
              </Button>
            </MotionDiv>

            <MotionDiv delay={0.15}>
              <div className={cn("rounded-2xl p-7", i % 2 === 0 ? "bg-navy" : "bg-white border border-brand-gray-light")}>
                <h3 className={cn("text-xs font-semibold uppercase tracking-[0.1em] mb-5", i % 2 === 0 ? "text-white/40" : "text-brand-gray")}>
                  What This Includes
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
          <SectionHeader eyebrow="How We Work" title="Our Process" light className="mb-14" />
          <MotionList className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROCESS.map((item) => (
              <MotionItem key={item.step}>
                <div className="bg-white/4 border border-white/7 rounded-xl p-6 hover:border-accent hover:bg-accent/5 transition-all duration-200">
                  <div className="text-xs font-bold text-accent tracking-wider mb-4">{item.step}</div>
                  <h3 className="font-display font-semibold text-white text-base mb-2">{item.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                </div>
              </MotionItem>
            ))}
          </MotionList>
        </div>
      </section>

      {/* ── WHY AYA ──────────────────────────── */}
      <section className="bg-brand-bg py-24">
        <div className="container">
          <SectionHeader eyebrow="Why Choose AYA Informatica" title="What Sets Us Apart" className="mb-14" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {WHY.map((item) => (
              <MotionItem key={item.title}>
                <div className="flex items-start gap-4 bg-white rounded-xl p-6 border border-brand-gray-light hover:border-accent hover:-translate-y-0.5 transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 text-accent flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-navy text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-brand-gray leading-relaxed">{item.desc}</p>
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
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">Ready to Build Something Great?</h2>
                <p className="text-brand-gray">Tell us about your project. We build for the future — grounded in the needs of today.</p>
              </div>
              <Button asChild size="lg"><Link href="/contact">Start a Conversation</Link></Button>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
