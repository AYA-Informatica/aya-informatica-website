import type { Metadata } from "next"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"
import { JsonLd } from "@/components/shared/json-ld"
// Local fonts — no network call required at build time
import "@fontsource/syne/600.css"
import "@fontsource/syne/700.css"
import "@fontsource/syne/800.css"
import "@fontsource/dm-sans/300.css"
import "@fontsource/dm-sans/400.css"
import "@fontsource/dm-sans/500.css"
import "@fontsource/dm-sans/600.css"
import "./globals.css"

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.com"

/* ── Root Metadata ────────────────────────────────────── */
export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "AYA Informatica – Building Africa's Digital Future",
    template: "%s | AYA Informatica",
  },
  description:
    "AYA Informatica is a Rwanda-based technology company building scalable digital platforms that connect people, businesses, and opportunities across Africa.",
  keywords: [
    "AYA Informatica",
    "Rwanda technology",
    "digital platforms",
    "Africa tech",
    "RAY marketplace",
    "Humura wellness",
    "Kigali startup",
    "mobile-first",
    "African digital infrastructure",
  ],
  authors: [{ name: "AYA Informatica" }],
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "AYA Informatica",
    title: "AYA Informatica – Building Africa's Digital Future",
    description:
      "Rwanda-based technology company building scalable digital platforms across Africa. Product-first. Mobile-first. Built for the continent.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AYA Informatica – Building Africa's Digital Future",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@ayainformatica",
    title: "AYA Informatica – Building Africa's Digital Future",
    description:
      "Rwanda-based technology company building scalable digital platforms across Africa.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  applicationName: "AYA Informatica",
  manifest: "/manifest.json",
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

/** Viewport config — required for themeColor in Next.js 14.2+ */
export const viewport = {
  themeColor: "#001529",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <JsonLd />
        <noscript>
          <style>{`[style*="opacity: 0"], [style*="opacity:0"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
      </head>
      <body>
        <Navbar />
        <main id="main-content" className="pt-[72px]">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
