import type { Metadata } from "next"
import { Suspense } from "react"
import { ContactForm } from "@/components/sections/contact-form"
import { TopicTags } from "@/components/sections/topic-tags"
import { MotionDiv } from "@/components/shared/motion-div"
import { CONTACT_INFO } from "@/lib/constants"
import { Mail, Phone, MapPin } from "lucide-react"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AYA Informatica. Partner with us, get early access to RAY, or discuss a project.",
  alternates: { canonical: "https://ayainformatica.tech/contact" },
  openGraph: {
    title: "Contact AYA Informatica – Let's Build Together",
    description: "Partner with us, get early access to RAY, discuss a service inquiry, or explore investment opportunities.",
    url: "https://ayainformatica.tech/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact AYA Informatica" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact AYA Informatica",
    description: "Partner with us or get in touch about our products and services.",
  },
}

export default function ContactPage() {
  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: "Contact", href: "/contact" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv><span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Contact Us</span></MotionDiv>
          <MotionDiv delay={0.1}>
            <h1 className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Let&apos;s Build<br /><span className="text-accent">Together</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Whether you want to partner, collaborate, get early access to our products,
              or simply learn more — we&apos;d love to hear from you.
            </p>
          </MotionDiv>
        </div>
      </section>

      {/* ── MAIN CONTACT SECTION ─────────────── */}
      <section className="bg-brand-bg py-24" aria-labelledby="contact-heading">
        <div className="container grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14 items-start">

          {/* Sidebar info — on mobile, shows after the form via order */}
          <MotionDiv className="order-2 lg:order-1">
            <div className="lg:sticky lg:top-28">
              <h2 id="contact-heading" className="font-display font-bold text-2xl text-navy mb-3">
                Get in Touch
              </h2>
              <p className="text-sm text-brand-gray leading-relaxed mb-8">
                We are based in Kigali, Rwanda — and we&apos;re building for all of Africa.
                Reach out and let&apos;s start a conversation.
              </p>

              <div className="flex flex-col gap-5 mb-8">
                {[
                  { icon: <Mail size={16} />, label: "Email", value: CONTACT_INFO.email, href: `mailto:${CONTACT_INFO.email}` },
                  { icon: <Phone size={16} />, label: "Phone / WhatsApp", value: CONTACT_INFO.phone, href: `tel:${CONTACT_INFO.phone.replace(/\s/g, "")}` },
                  { icon: <MapPin size={16} />, label: "Location", value: CONTACT_INFO.location, href: undefined },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy/8 text-navy flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <span className="block text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-brand-gray mb-0.5">
                        {item.label}
                      </span>
                      {item.href ? (
                        <a href={item.href} className="text-sm font-medium text-brand-dark hover:text-accent transition-colors">
                          {item.value}
                        </a>
                      ) : (
                        <span className="text-sm font-medium text-brand-dark">{item.value}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Topic tags — clicking scrolls to form and pre-fills subject */}
              <TopicTags />
            </div>
          </MotionDiv>

          {/* Contact form — on mobile, shows first via order */}
          <MotionDiv delay={0.15} className="order-1 lg:order-2">
            <Suspense>
              <ContactForm />
            </Suspense>
          </MotionDiv>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────── */}
      <section className="bg-navy py-16">
        <div className="container">
          <MotionDiv>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 flex-wrap">
              <div>
                <blockquote className="font-display text-xl sm:text-2xl font-bold italic text-white mb-2">
                  &ldquo;Partner with us to build the future.&rdquo;
                </blockquote>
                <cite className="text-xs text-white/30 not-italic">— AYA Informatica</cite>
              </div>
              <div className="flex gap-3">
                {[{ label: "Builders", icon: "🔨" }, { label: "Engineers", icon: "⚙️" }, { label: "Thinkers", icon: "💡" }].map((item) => (
                  <div key={item.label} className="flex flex-col items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-5 py-4">
                    <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    <span className="text-xs text-white/55 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </MotionDiv>
        </div>
      </section>
    </PageWrapper>
  )
}
