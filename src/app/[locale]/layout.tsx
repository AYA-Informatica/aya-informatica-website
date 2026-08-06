import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { JsonLd } from "@/components/shared/json-ld"
import { ThemeProvider } from "@/components/shared/theme-provider"
import { type Locale, locales } from "@/i18n/config"
import { BASE_URL, localeAlternates, localeUrl } from "@/lib/urls"
// Variable fonts — single file per family, all weights included
import "@fontsource-variable/syne"
import "@fontsource-variable/dm-sans"
import "../globals.css"

/** Pre-render every locale at build time rather than on demand. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

/* ── Root Metadata ────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  const t = await getTranslations({ locale, namespace: "metadata" })

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: t("defaultTitle"),
      template: t("titleTemplate"),
    },
    description: t("description"),
    keywords: t("keywords").split("|"),
    authors: [{ name: t("siteName") }],
    alternates: {
      canonical: localeUrl(locale),
      // hreflang so search engines serve the right language per visitor.
      languages: localeAlternates(),
    },
    openGraph: {
      type: "website",
      locale,
      url: localeUrl(locale),
      siteName: t("siteName"),
      title: t("defaultTitle"),
      description: t("ogDescription"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("defaultTitle"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@ayainformatica",
      title: t("defaultTitle"),
      description: t("twitterDescription"),
      images: ["/og-image.png"],
    },
    icons: {
      // One mark everywhere: the circular badge. There was also a favicon.svg
      // carrying a different design — a navy square reading "AYA" over "RW" —
      // and because browsers prefer an SVG icon when one is offered, Chrome and
      // Firefox showed the square while bookmarks and the home screen showed
      // the circle. The SVG is gone rather than redrawn; it is in git history
      // if the square is ever wanted back.
      //
      // Every raster here is generated from apple-touch-icon.png by
      // `npm run generate-icons`, so they cannot drift apart again.
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      ],
      shortcut: [{ url: "/favicon.ico" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    applicationName: t("siteName"),
    manifest: "/manifest.json",
    // Search Console is currently verified by the file in public/, which only
    // resolves on the host it was uploaded for — it 308s on the apex and 200s
    // on www. The meta-tag method is host-independent and survives a domain
    // change, but its token is different from the filename and only Search
    // Console can issue it. Paste it into GOOGLE_SITE_VERIFICATION and this
    // renders; leave it unset and nothing is emitted.
    verification: process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : undefined,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  }
}

/** Viewport config — required for themeColor in Next.js 14.2+ */
export const viewport = {
  // Per-scheme so the browser chrome matches the rendered page. This follows
  // the OS setting rather than the in-page toggle — the meta tag is read before
  // any script runs, so it cannot reflect a stored override.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#001529" },
    { media: "(prefers-color-scheme: dark)", color: "#05080C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()

  // Opts this layout into static rendering for the given locale.
  setRequestLocale(locale)

  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <JsonLd />
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body>
        <ThemeProvider>
          <NextIntlClientProvider>
            <Navbar />
            <main id="main-content" className="pt-[var(--navbar-height)]">
              {children}
            </main>
            <Footer />
            <Toaster />
          </NextIntlClientProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
