import { useTranslations } from "next-intl"
import { Mail, Phone, MapPin } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Logo } from "@/components/shared/logo"
import { NAV_LINKS, CONTACT_INFO } from "@/lib/constants"

export function Footer() {
  const t = useTranslations("footer")
  const tNav = useTranslations("nav")
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy text-white/60" role="contentinfo">
      <div className="container pt-12 sm:pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-white/8">

          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={t("homeAriaLabel")} className="inline-block mb-5">
              <Logo variant="white" alt={t("homeAriaLabel")} className="h-14" />
            </Link>
            <p className="font-display text-sm font-semibold text-white/80 leading-snug mb-3">
              {t("brandLine1")}<br />{t("brandLine2")}
            </p>
            <p className="text-xs text-white/55 flex items-center gap-1.5">
              <MapPin size={11} />
              {t("location")}
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/55 mb-4">
              {t("navigate")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map(({ href, key }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/55 hover:text-white transition-colors"
                  >
                    {tNav(key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/55 mb-4">
              {t("products")}
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link href="/products" className="text-sm text-white/55 hover:text-white transition-colors">
                  {t("rayLabel")}
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-sm text-white/55 hover:text-white transition-colors">
                  {t("humuraLabel")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-white/55 mb-4">
              {t("getInTouch")}
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
          <p className="text-xs text-white/45">
            &copy; {year} {t("companyName")}. {t("rights")}
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-white/45 hover:text-white/60 transition-colors">
              {t("privacy")}
            </Link>
            <span className="text-white/35 text-xs">·</span>
            <Link href="/terms" className="text-xs text-white/45 hover:text-white/60 transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
