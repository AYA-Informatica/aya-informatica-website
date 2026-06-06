import Link from "next/link"
import { Mail, Phone, MapPin } from "lucide-react"
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white/60" role="contentinfo">
      <div className="container pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="AYA Informatica home">
              <div className="flex flex-col gap-0.5 mb-5">
                <span className="font-display text-2xl font-extrabold text-white tracking-[0.04em] leading-none">
                  AYA
                </span>
                <span className="text-[0.65rem] text-white/35 uppercase tracking-[0.08em]">
                  Informatica
                </span>
              </div>
            </Link>
            <p className="font-display text-sm font-semibold text-white/80 leading-snug mb-3">
              Building Africa&apos;s<br />Digital Future
            </p>
            <p className="text-xs text-white/35 flex items-center gap-1.5">
              <MapPin size={11} />
              Kigali, Rwanda
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/35 mb-4">
              Navigate
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/35 mb-4">
              Products
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/products" className="text-sm text-white/55 hover:text-white transition-colors">
                  RAY – Marketplace
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-white/55 hover:text-white transition-colors">
                  Humura – Wellness
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/35 mb-4">
              Get in Touch
            </h3>
            <ul className="flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${CONTACT_INFO.email}`}
                  className="text-xs text-white/55 hover:text-white transition-colors flex items-start gap-2"
                >
                  <Mail size={12} className="mt-0.5 shrink-0" />
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                  className="text-sm text-white/55 hover:text-white transition-colors flex items-center gap-2"
                >
                  <Phone size={12} className="shrink-0" />
                  {CONTACT_INFO.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 flex-wrap">
          <p className="text-xs text-white/30">
            &copy; {year} AYA Informatica. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-white/15 text-xs">·</span>
            <Link href="/terms" className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
