import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MotionDiv, MotionList, MotionItem } from "@/components/shared/motion-div"
import { PageWrapper } from "@/components/shared/page-wrapper"
import { BreadcrumbJsonLd } from "@/components/shared/json-ld"

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Insights, updates, and stories from AYA Informatica — building Africa's digital future from Kigali, Rwanda.",
  alternates: { canonical: "https://ayainformatica.tech/blog" },
  openGraph: {
    title: "AYA Informatica Blog – Insights & Updates",
    description: "Insights, updates, and stories from AYA Informatica.",
    url: "https://ayainformatica.tech/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AYA Informatica Blog" }],
  },
}

const POSTS = [
  {
    slug: "building-for-africa",
    title: "Why We're Building for Africa First",
    excerpt: "Africa's digital economy is growing faster than anywhere else. Here's why we chose to build from Kigali and what it means for our products.",
    date: "2025-06-15",
    category: "Company",
    readTime: "5 min read",
  },
  {
    slug: "ray-marketplace-vision",
    title: "RAY: Rethinking How Rwanda Trades",
    excerpt: "From fragmented WhatsApp groups to a unified marketplace — the story behind RAY and our vision for digital commerce in East Africa.",
    date: "2025-05-28",
    category: "Product",
    readTime: "7 min read",
  },
  {
    slug: "mental-wellness-africa",
    title: "Mental Wellness in Africa: The Gap We're Filling with Humura",
    excerpt: "Mental health support in Africa remains critically underserved. Humura is our answer — a platform designed with cultural sensitivity at its core.",
    date: "2025-05-10",
    category: "Product",
    readTime: "6 min read",
  },
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BlogPage() {
  return (
    <PageWrapper>
      <BreadcrumbJsonLd items={[{ name: "Blog", href: "/blog" }]} />
      {/* ── HERO ─────────────────────────────── */}
      <section className="relative bg-navy py-24 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+6rem)] overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="absolute top-0 left-[40%] w-0.5 h-full bg-accent/10 -rotate-12 origin-top" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <MotionDiv>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50">Blog</span>
          </MotionDiv>
          <MotionDiv delay={0.1}>
            <h1
              className="font-display font-bold text-white leading-tight mt-3 mb-5"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
            >
              Insights &<br />
              <span className="text-accent">Updates</span>
            </h1>
          </MotionDiv>
          <MotionDiv delay={0.2}>
            <p className="text-white/60 text-lg max-w-xl leading-relaxed">
              Stories, product updates, and perspectives from the team building
              Africa&apos;s digital future.
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
                    <span className="font-display text-5xl font-extrabold text-navy/6 select-none">AYA</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="navy" className="text-[0.6rem]">{post.category}</Badge>
                      <span className="text-[0.65rem] text-brand-gray">{post.readTime}</span>
                    </div>
                    <h2 className="font-display font-bold text-lg text-navy mb-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-sm text-brand-gray leading-relaxed mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <time className="text-xs text-brand-gray" dateTime={post.date}>
                        {formatDate(post.date)}
                      </time>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-accent group-hover:gap-2 transition-all">
                        Read <ArrowRight size={14} />
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
                Stay in the Loop
              </h2>
              <p className="text-brand-gray mb-8">
                Want to follow our journey? Get in touch and we&apos;ll keep you updated on our latest developments.
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
