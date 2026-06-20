import type { Metadata } from "next"
import Link from "next/link"
import { PageWrapper } from "@/components/shared/page-wrapper"

export const metadata: Metadata = {
  title: "Terms of Use",
  description:
    "Terms and conditions for using the AYA Informatica website and services.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://ayainformatica.com/terms" },
}

const LAST_UPDATED = "June 2025"
const CONTACT_EMAIL = "ay.company.andy@gmail.com"
const COMPANY = "AYA Informatica"
const SITE = "ayainformatica.com"

export default function TermsPage() {
  return (
    <PageWrapper>
      {/* ── HERO ─────────────────────────────── */}
      <section className="bg-navy py-20 -mt-[72px] pt-[calc(72px+5rem)] relative overflow-hidden">
        <div className="absolute inset-0 navy-grid" aria-hidden="true" />
        <div className="container relative z-10 pt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-white/50 block mb-3">
            Legal
          </span>
          <h1
            className="font-display font-bold text-white leading-tight mb-4"
            style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
          >
            Terms of Use
          </h1>
          <p className="text-white/55 text-sm">
            Last updated: <time dateTime="2025-06">{LAST_UPDATED}</time>
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────── */}
      <div className="bg-white">
        <div className="container py-16 max-w-4xl">
          <article className="privacy-content" aria-label="Terms of use content">

            <section id="acceptance" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                1. Acceptance of Terms
              </h2>
              <div className="privacy-body">
                <p>
                  By accessing and using the website at <strong>{SITE}</strong>{" "}
                  (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use. If
                  you do not agree to these terms, please do not use the Site.
                </p>
                <p>
                  {COMPANY} reserves the right to update these Terms at any
                  time. Continued use of the Site after changes constitutes
                  your acceptance of the updated Terms.
                </p>
              </div>
            </section>

            <section id="use" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                2. Permitted Use
              </h2>
              <div className="privacy-body">
                <p>You may use this Site for lawful purposes only. You agree not to:</p>
                <ul>
                  <li>Use the Site in any way that violates applicable local, national, or international laws</li>
                  <li>Transmit unsolicited commercial communications (spam) via our contact form</li>
                  <li>Attempt to gain unauthorised access to any part of the Site</li>
                  <li>Introduce viruses, malware, or other harmful code</li>
                  <li>Scrape or harvest data from the Site in an automated fashion without written permission</li>
                  <li>Misrepresent your identity or affiliation when contacting us</li>
                </ul>
              </div>
            </section>

            <section id="ip" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                3. Intellectual Property
              </h2>
              <div className="privacy-body">
                <p>
                  All content on this Site — including text, graphics, logos, icons,
                  product names (RAY, Humura), and the overall look and feel — is the
                  exclusive property of {COMPANY} and is protected by applicable
                  copyright, trademark, and intellectual property laws.
                </p>
                <p>
                  You may not reproduce, distribute, modify, create derivative works
                  of, or commercially exploit any content from this Site without our
                  express written consent.
                </p>
              </div>
            </section>

            <section id="disclaimer" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                4. Disclaimer of Warranties
              </h2>
              <div className="privacy-body">
                <p>
                  The Site is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without any
                  warranties of any kind, either express or implied, including but
                  not limited to implied warranties of merchantability, fitness for
                  a particular purpose, or non-infringement.
                </p>
                <p>
                  {COMPANY} does not warrant that the Site will be uninterrupted,
                  error-free, or free of viruses or other harmful components.
                </p>
              </div>
            </section>

            <section id="liability" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                5. Limitation of Liability
              </h2>
              <div className="privacy-body">
                <p>
                  To the fullest extent permitted by law, {COMPANY} shall not be
                  liable for any indirect, incidental, special, consequential, or
                  punitive damages arising out of or in connection with your use
                  of the Site, even if we have been advised of the possibility of
                  such damages.
                </p>
              </div>
            </section>

            <section id="links" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                6. Third-Party Links
              </h2>
              <div className="privacy-body">
                <p>
                  The Site may contain links to third-party websites. These links
                  are provided for your convenience only. {COMPANY} has no control
                  over the content or practices of those sites and accepts no
                  responsibility for them. Linking to a third-party site does not
                  imply endorsement.
                </p>
              </div>
            </section>

            <section id="governing-law" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                7. Governing Law
              </h2>
              <div className="privacy-body">
                <p>
                  These Terms are governed by and construed in accordance with the
                  laws of the Republic of Rwanda. Any disputes arising from or
                  relating to these Terms shall be subject to the exclusive
                  jurisdiction of the courts of Rwanda.
                </p>
              </div>
            </section>

            <section id="contact" className="mb-10 scroll-mt-28">
              <h2 className="font-display font-bold text-xl text-navy mb-4 pb-3 border-b border-brand-gray-light">
                8. Contact
              </h2>
              <div className="privacy-body">
                <p>
                  For any questions about these Terms, please contact us:
                </p>
                <address className="not-italic">
                  <strong>{COMPANY}</strong>
                  <br />
                  Kigali, Rwanda
                  <br />
                  <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
                </address>
              </div>
            </section>

          </article>

          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-brand-gray-light flex flex-wrap gap-4">
            <Link href="/" className="text-sm text-accent hover:text-[#0066CC] font-medium transition-colors">
              ← Back to Home
            </Link>
            <Link href="/privacy" className="text-sm text-accent hover:text-[#0066CC] font-medium transition-colors">
              Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
