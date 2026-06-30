import type { Metadata } from "next"
import Link from "next/link"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How AYA Informatica collects, uses, and protects your personal information when you use our website and contact form.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ayainformatica.tech/privacy" },
}

const LAST_UPDATED = "June 2025"
const CONTACT_EMAIL = "ay.company.andy@gmail.com"

const TOC = [
  { id: "overview",        label: "1. Overview" },
  { id: "data-collected",  label: "2. Information We Collect" },
  { id: "how-we-use",      label: "3. How We Use Your Information" },
  { id: "third-parties",   label: "4. Third-Party Services" },
  { id: "data-retention",  label: "5. Data Retention" },
  { id: "your-rights",     label: "6. Your Rights" },
  { id: "security",        label: "7. Security" },
  { id: "children",        label: "8. Children's Privacy" },
  { id: "changes",         label: "9. Changes to This Policy" },
  { id: "contact",         label: "10. Contact Us" },
]

function SectionHeading({ id, title }: { id: string; title: string }) {
  return (
    <h2 id={id} className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light scroll-mt-28">
      {title}
    </h2>
  )
}

export default function PrivacyPage() {
  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────── */}
      <section className="bg-navy py-20 -mt-[var(--navbar-height)] pt-[calc(var(--navbar-height)+5rem)] relative overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50 block mb-3">
            Legal
          </span>
          <h1 className="font-display font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Privacy Policy
          </h1>
          <p className="text-white/55 text-sm">
            Last updated: <time dateTime="2025-06">{LAST_UPDATED}</time>
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────── */}
      <div className="bg-white">
        <div className="container py-16">
          {/* Mobile TOC — horizontal scrollable */}
          <nav className="lg:hidden overflow-x-auto pb-4 mb-8 border-b border-brand-gray-light -mx-4 px-4" aria-label="Table of contents">
            <ul className="flex gap-2 whitespace-nowrap">
              {TOC.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}
                    className="text-xs text-brand-gray hover:text-navy hover:bg-navy/5 transition-colors px-3 py-1.5 rounded-full border border-brand-gray-light inline-block">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-start">

            {/* Desktop sticky TOC */}
            <nav className="hidden lg:block sticky top-28 self-start" aria-label="Table of contents">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-brand-gray mb-3">
                Contents
              </p>
              <ul className="flex flex-col gap-1.5">
                {TOC.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`}
                      className="text-xs text-brand-gray hover:text-navy transition-colors leading-relaxed">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Body */}
            <article className="privacy-content max-w-3xl">

              <section id="overview" className="mb-10 scroll-mt-28">
                <SectionHeading id="overview" title="1. Overview" />
                <div className="privacy-body">
                  <p>AYA Informatica (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the website <strong>ayainformatica.tech</strong> (the &ldquo;Site&rdquo;). This Privacy Policy explains what personal information we collect, how we use it, and the choices you have.</p>
                  <p>By using our Site you agree to the practices described here. If you do not agree, please do not use the Site.</p>
                </div>
              </section>

              <section id="data-collected" className="mb-10 scroll-mt-28">
                <SectionHeading id="data-collected" title="2. Information We Collect" />
                <div className="privacy-body">
                  <p>We collect only the minimum information necessary. We do <strong>not</strong> run advertising, third-party tracking pixels, or behavioural analytics.</p>
                  <h3>2.1 Information you provide directly</h3>
                  <p>When you submit our contact form:</p>
                  <ul>
                    <li><strong>Full name</strong> — to address you correctly</li>
                    <li><strong>Email address</strong> — to reply to your message</li>
                    <li><strong>Phone number</strong> — optional, only if you provide it</li>
                    <li><strong>Subject &amp; message</strong> — the content of your enquiry</li>
                  </ul>
                  <h3>2.2 Information collected automatically</h3>
                  <p>Our web host (Vercel) may automatically collect standard server-log data: IP address (anonymised after 24 hours), browser type, pages visited, and referring URL. This is used solely for security and infrastructure. We do not build profiles from it.</p>
                  <h3>2.3 Cookies</h3>
                  <p>This Site does <strong>not</strong> set any first-party cookies or use cookie-based analytics. Our hosting provider may set a technical session cookie strictly necessary to serve the site. No marketing or tracking cookies are used.</p>
                </div>
              </section>

              <section id="how-we-use" className="mb-10 scroll-mt-28">
                <SectionHeading id="how-we-use" title="3. How We Use Your Information" />
                <div className="privacy-body">
                  <p>We use the information you submit only to:</p>
                  <ul>
                    <li>Respond to your enquiry or partnership request</li>
                    <li>Carry out pre-contractual communications</li>
                    <li>Comply with legal obligations</li>
                  </ul>
                  <p>We will never sell, rent, or share your personal data with third parties for marketing purposes.</p>
                </div>
              </section>

              <section id="third-parties" className="mb-10 scroll-mt-28">
                <SectionHeading id="third-parties" title="4. Third-Party Services" />
                <div className="privacy-body">
                  <p>We use the following sub-processors. Each is bound by their own privacy policy:</p>
                  <div className="overflow-x-auto mt-4">
                    <table>
                      <thead>
                        <tr>
                          <th>Service</th>
                          <th>Purpose</th>
                          <th>Data shared</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Vercel</strong></td>
                          <td>Hosting &amp; CDN</td>
                          <td>IP, request logs</td>
                        </tr>
                        <tr>
                          <td><strong>SMTP Provider</strong></td>
                          <td>Contact form email delivery</td>
                          <td>Form fields (name, email, message)</td>
                        </tr>
                        <tr>
                          <td><strong>@fontsource</strong></td>
                          <td>Self-hosted typography</td>
                          <td>None — fonts load locally, no network request</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>

              <section id="data-retention" className="mb-10 scroll-mt-28">
                <SectionHeading id="data-retention" title="5. Data Retention" />
                <div className="privacy-body">
                  <p>Contact form submissions are retained in our email inbox for as long as necessary to fulfil the purpose of your enquiry, and no longer than <strong>2 years</strong> unless a longer period is required by law. Server logs collected by Vercel are automatically deleted after 30 days.</p>
                </div>
              </section>

              <section id="your-rights" className="mb-10 scroll-mt-28">
                <SectionHeading id="your-rights" title="6. Your Rights" />
                <div className="privacy-body">
                  <p>Depending on your location, you may have the following rights:</p>
                  <ul>
                    <li><strong>Access</strong> — request a copy of the data we hold about you</li>
                    <li><strong>Rectification</strong> — ask us to correct inaccurate data</li>
                    <li><strong>Erasure</strong> — request deletion of your data</li>
                    <li><strong>Portability</strong> — receive your data in a machine-readable format</li>
                    <li><strong>Objection</strong> — object to processing based on legitimate interests</li>
                  </ul>
                  <p>To exercise any of these rights, email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We will respond within <strong>30 days</strong>. Rwandan residents may also contact the Rwanda Information Society Authority (RISA).</p>
                </div>
              </section>

              <section id="security" className="mb-10 scroll-mt-28">
                <SectionHeading id="security" title="7. Security" />
                <div className="privacy-body">
                  <p>We implement appropriate technical and organisational measures including:</p>
                  <ul>
                    <li>HTTPS / TLS encryption on all pages</li>
                    <li>HTTP security headers (HSTS, CSP, X-Frame-Options)</li>
                    <li>Rate limiting on our API endpoints</li>
                    <li>Input validation and sanitisation on all form fields</li>
                  </ul>
                  <p>No method of internet transmission is 100% secure. We take commercially reasonable precautions but cannot guarantee absolute security.</p>
                </div>
              </section>

              <section id="children" className="mb-10 scroll-mt-28">
                <SectionHeading id="children" title="8. Children's Privacy" />
                <div className="privacy-body">
                  <p>Our Site is not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has submitted information to us, please contact us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will delete it promptly.</p>
                </div>
              </section>

              <section id="changes" className="mb-10 scroll-mt-28">
                <SectionHeading id="changes" title="9. Changes to This Policy" />
                <div className="privacy-body">
                  <p>We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last Updated&rdquo; date. Continued use of the Site after changes constitutes acceptance of the updated policy.</p>
                </div>
              </section>

              <section id="contact" className="mb-10 scroll-mt-28">
                <SectionHeading id="contact" title="10. Contact Us" />
                <div className="privacy-body">
                  <p>For any questions about this Privacy Policy:</p>
                  <address className="not-italic">
                    <strong>AYA Informatica</strong><br />
                    Kigali, Rwanda<br />
                    <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a><br />
                    <a href="tel:+250787891746">+250 787 891 746</a>
                  </address>
                </div>
              </section>

            </article>
          </div>

          <div className="mt-12 pt-8 border-t border-brand-gray-light flex flex-wrap gap-4">
            <Link href="/" className="text-sm text-accent hover:text-[#0066CC] font-medium transition-colors">
              ← Back to Home
            </Link>
            <Link href="/contact" className="text-sm text-accent hover:text-[#0066CC] font-medium transition-colors">
              Contact Us →
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
