"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import FocusLock from "react-focus-lock"
import { Menu, X } from "lucide-react"
import { Link, usePathname } from "@/i18n/navigation"
import { useUIStore } from "@/store/ui"
import { NAV_LINKS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/layout/language-switcher"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { Logo } from "@/components/shared/logo"
import { cn } from "@/lib/utils"
import { useScrolled } from "@/hooks/use-scrolled"

export function Navbar() {
  const t = useTranslations("nav")
  const pathname = usePathname()
  const { mobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore()
  const scrolled = useScrolled(20)

  const isHome = pathname === "/"
  const isSolid = scrolled || !isHome

  // Close menu on route change
  useEffect(() => { closeMobileMenu() }, [pathname, closeMobileMenu])

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileMenuOpen])

  // FIX #17: Close mobile menu on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileMenuOpen) closeMobileMenu()
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [mobileMenuOpen, closeMobileMenu])

  return (
    <>
      {/* Skip link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        {t("skipToContent")}
      </a>

      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isSolid
            ? "bg-navy/97 backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.06)] py-3"
            : "bg-transparent py-5"
        )}
        role="banner"
      >
        <div className="container flex items-center gap-3 sm:gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center shrink-0"
            aria-label={t("homeAriaLabel")}
          >
            <Logo
              variant="white"
              priority
              alt={t("homeAriaLabel")}
              className={cn("transition-all duration-300", isSolid ? "h-9" : "h-10")}
            />
          </Link>

          {/* Desktop nav */}
          <nav
            className="hidden md:flex items-center gap-1 ml-auto"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                className={cn(
                  "relative px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === href
                    ? "text-white"
                    : "text-white/65 hover:text-white hover:bg-white/7"
                )}
              >
                {t(key)}
                {pathname === href && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Theme + language + desktop CTA */}
          <ThemeToggle className="hidden md:inline-flex ml-2" />
          <LanguageSwitcher className="hidden md:flex" />
          <Button asChild size="sm" className="hidden md:inline-flex ml-1">
            <Link href="/contact">{t("partnerWithUs")}</Link>
          </Button>

          {/* Mobile hamburger */}
          <button
            type="button"
            className="md:hidden ml-auto p-2 rounded-md text-white/80 hover:bg-white/10 transition-colors"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-nav"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-navy flex flex-col items-center justify-center"
          >
            <FocusLock returnFocus>
              <nav
                className="flex flex-col items-center gap-2 w-full max-w-xs"
                aria-label="Mobile navigation"
              >
                {NAV_LINKS.map(({ href, key }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.07, duration: 0.3 }}
                    className="w-full text-center"
                  >
                    <Link
                      href={href}
                      aria-current={pathname === href ? "page" : undefined}
                      className={cn(
                        "block font-display text-[2rem] font-bold py-2 transition-colors",
                        pathname === href
                          ? "text-accent"
                          : "text-white/40 hover:text-white"
                      )}
                    >
                      {t(key)}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: NAV_LINKS.length * 0.07 + 0.05, duration: 0.3 }}
                  className="w-full mt-6 flex flex-col items-center gap-5"
                >
                  <Button asChild className="w-full" size="lg">
                    <Link href="/contact">{t("partnerWithUs")}</Link>
                  </Button>
                  <div className="flex items-center gap-4">
                    <LanguageSwitcher />
                    <ThemeToggle />
                  </div>
                </motion.div>
              </nav>
            </FocusLock>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}


