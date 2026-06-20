import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SectionHeader } from "@/components/shared/section-header"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { PRODUCTS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const metadata: Metadata = {
  title: "Products",
  description:
    "Discover RAY, Rwanda's mobile-first marketplace, and Humura, our upcoming mental wellness platform. Platforms designed for real people.",
  alternates: { canonical: "https://ayainformatica.com/products" },
  openGraph: {
    title: "AYA Informatica Products – RAY Marketplace & Humura Wellness",
    description: "RAY: Rwanda's mobile-first marketplace for phones and electronics. Humura: mental wellness platform coming soon.",
    url: "https://ayainformatica.com/products",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AYA Informatica Products" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AYA Informatica Products – RAY & Humura",
    description: "RAY: Rwanda's mobile-first marketplace. Humura: mental wellness platform coming soon.",
  },
}

const RAY_FEATURES = [
  { title: "Quick Listings", desc: "Post items in seconds — simple forms, fast uploads, immediate visibility." },
  { title: "Direct Connection", desc: "Connect directly with buyers or sellers. No middlemen, no hidden fees." },
  { title: "Transparent Pricing", desc: "Negotiate prices openly. What you see is what you get." },
  { title: "Wider Market", desc: "Access a wider, more active market than local classifieds or groups." },
  { title: "Trust-First Design", desc: "Verified sellers and safe messaging built in from day one." },
  { title: "Mobile-First", desc: "Optimized for mobile — the way most Rwandans access the internet." },
]

export default function ProductsPage() {
  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[72px] pt-[calc(72px+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv><span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Our Products</span></MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Platforms Designed<br /><span className="text-accent">for Real Life</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Each product is grounded in a real problem, designed for accessibility,
              and engineered to scale. We don&apos;t build apps — we build digital infrastructure.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── RAY DETAIL ───────────────────────── */}
      <section className="bg-white py-24" aria-labelledby="ray-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <MotionDiv>
            <Badge className="mb-5">🔥 Flagship Platform</Badge>
            <h2 id="ray-heading" className="font-display font-extrabold text-navy leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(3rem, 6vw, 5rem)" }}
            >
              RAY
            </h2>
<p className="text-accent font-medium mb-4">Rwanda&apos;s mobile-first marketplace for buying and selling.</p>
            <div className="space-y-3 text-brand-gray text-sm leading-relaxed mb-7">
              <p>RAY is a mobile-first marketplace designed to simplify buying and selling in Rwanda, starting with phones and electronics.</p>
              <p>Built on trust, speed, and accessibility — RAY connects buyers and sellers directly and transparently. Our goal is to make RAY the default platform for everyday commerce in Rwanda.</p>
            </div>

            {/* Three pillars */}
            <div className="flex flex-col gap-3 mb-7">
              {[
                { icon: "🛡", title: "Trust", desc: "Every interaction designed to build user trust." },
                { icon: "📱", title: "Accessibility", desc: "Built mobile-first for how Rwanda uses technology." },
                { icon: "⚡", title: "Speed", desc: "Fast to list, connect, and close a deal." },
              ].map((p) => (
                <div key={p.title} className="flex items-start gap-4 p-4 bg-brand-bg rounded-xl border border-brand-gray-light hover:border-accent transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg shrink-0">{p.icon}</div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-navy mb-0.5">{p.title}</h4>
                    <p className="text-xs text-brand-gray">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild size="lg">
              <Link href="/contact">Get Early Access</Link>
            </Button>
          </MotionDiv>

          {/* Phone mockup */}
          <MotionDiv delay={0.15}>
            <div className="bg-navy rounded-3xl p-5 sm:p-6 shadow-[0_40px_80px_rgba(0,21,41,0.25)] max-w-[260px] sm:max-w-[300px] mx-auto w-full">
              <div className="flex justify-between items-center mb-4">
                <span className="font-display text-xl font-extrabold text-white">RAY</span>
                <span className="text-xs text-white/40">📍 Kigali</span>
              </div>
              <div className="flex items-center gap-2 bg-white/7 rounded-lg px-3 py-2.5 mb-4">
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none" className="text-white/40" aria-hidden="true">
                  <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M9 9l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-xs text-white/35">Search phones &amp; electronics…</span>
              </div>
              <div className="flex flex-col gap-2 mb-3">
                {[
                  { name: "iPhone 14 Pro", price: "RWF 850,000" },
                  { name: "Samsung S23", price: "RWF 620,000" },
                  { name: "Tecno Camon 20", price: "RWF 185,000" },
                ].map((item) => (
                  <div key={item.name} className="flex items-center gap-3 bg-white/5 rounded-lg p-2.5">
                    <div className="w-9 h-9 rounded-md bg-gradient-to-br from-accent/30 to-white/10 shrink-0" />
                    <div>
                      <div className="text-xs font-semibold text-white">{item.name}</div>
                      <div className="text-[0.65rem] text-accent">{item.price}</div>
                      <div className="text-[0.6rem] text-white/35">Verified Seller</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-accent rounded-lg py-2.5 text-center text-xs font-semibold text-white">
                + Post Item
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>

      {/* ── RAY FEATURES ─────────────────────── */}
      <section className="bg-brand-bg py-20" aria-labelledby="ray-features-heading">
        <div className="container">
          <SectionHeader eyebrow="RAY – Key Features" title="What Makes RAY Different" className="mb-12" />
          <MotionList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RAY_FEATURES.map((f) => (
              <MotionItem key={f.title}>
                <div className="bg-white rounded-xl p-6 border border-brand-gray-light
                  relative overflow-hidden group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200">
                  <div className="absolute top-0 left-0 w-0.5 h-0 bg-accent group-hover:h-full transition-all duration-300 rounded-bl" />
                  <h4 className="font-display font-bold text-navy text-sm mb-2">{f.title}</h4>
                  <p className="text-xs text-brand-gray leading-relaxed">{f.desc}</p>
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
                <span className="font-display text-xl font-extrabold text-navy">Humura</span>
                <span className="text-xs text-brand-gray uppercase tracking-wider">Mental Wellness</span>
              </div>
              {[
                { label: "Safe Space", pos: "top-4 left-0" },
                { label: "Anonymous", pos: "top-4 right-0" },
                { label: "Support", pos: "bottom-12 left-0" },
                { label: "Wellbeing", pos: "bottom-12 right-0" },
              ].map((tag) => (
                <span
                  key={tag.label}
                  className={cn("absolute text-xs font-medium text-accent bg-accent/10 px-2.5 py-1 rounded-full", tag.pos)}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          </MotionDiv>

          {/* Text */}
          <MotionDiv delay={0.1}>
            <Badge variant="navy" className="mb-5">🧠 Upcoming Platform</Badge>
            <h2 id="humura-heading" className="font-display font-extrabold text-navy leading-none tracking-tight mb-3"
              style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
            >
              Humura
            </h2>
            <p className="text-accent font-medium mb-4">Mental wellness and emotional support — for Africa.</p>
            <p className="text-brand-gray text-sm leading-relaxed mb-6">
              Humura reflects our commitment to building not only powerful systems but
              meaningful ones — platforms that matter to the people who use them.
            </p>
            <ul className="flex flex-col gap-3 mb-7">
              {PRODUCTS[1].features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-brand-dark">
                  <CheckCircle2 size={16} className="text-accent shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline-dark" size="lg">
              <Link href="/contact">Stay Updated on Humura</Link>
            </Button>
          </MotionDiv>
        </div>
      </section>

      {/* ── ECOSYSTEM ────────────────────────── */}
      <section className="bg-navy py-24">
        <div className="container">
          <SectionHeader
            eyebrow="The Vision"
            title={<>Building an Integrated<br />Digital Ecosystem</>}
            description="RAY and Humura are the first pieces of a larger vision — an interconnected ecosystem of platforms that power everyday African life."
            light
            className="mb-14"
          />
          <MotionDiv>
            <div className="flex flex-col items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-accent flex flex-col items-center justify-center
                shadow-[0_0_60px_rgba(10,132,255,0.3)]">
                <span className="font-display text-2xl font-extrabold text-white leading-none">AYA</span>
                <span className="text-[0.55rem] text-white/65 uppercase tracking-wider">Ecosystem</span>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center px-4">
                {[
                  { name: "RAY", desc: "Commerce", active: true },
                  { name: "Humura", desc: "Wellness", active: false },
                  { name: "More", desc: "Coming soon", active: false },
                ].map((node) => (
                  <div
                    key={node.name}
                    className={cn(
                      "flex flex-col items-center gap-1 px-4 sm:px-6 py-4 rounded-xl border text-center min-w-[100px] sm:min-w-[120px]",
                      node.active
                        ? "border-accent bg-accent/10"
                        : "border-white/8 bg-white/3"
                    )}
                  >
                    <span className="font-display font-bold text-white text-sm">{node.name}</span>
                    <span className="text-[0.65rem] text-white/40 uppercase tracking-wider">{node.desc}</span>
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
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-navy mb-2">Interested in Our Platforms?</h2>
                <p className="text-brand-gray">Reach out to partner with us or get early access.</p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button asChild size="lg"><Link href="/contact">Contact Us</Link></Button>
                <Button asChild variant="outline-dark" size="lg"><Link href="/services">See Services</Link></Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
