"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("common")

  useEffect(() => {
    // Client-side error boundary logging
    // In production, wire this to a client-safe error tracker (e.g. Sentry)
    if (process.env.NODE_ENV !== "production") {
      console.error("[ErrorBoundary]", error.message)
    } else {
      // In production: only log the digest (opaque ID), never the full error
      console.error("[ErrorBoundary] digest:", error.digest)
    }
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-surface">
      <div className="container py-20 flex flex-col items-center text-center max-w-md">
        <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-6">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
            <path d="M12 7v5M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 className="font-display font-bold text-2xl text-content-strong mb-3">
          {t("errorTitle")}
        </h2>
        <p className="text-sm text-content-muted leading-relaxed mb-8">
          {t("errorDesc")}
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center justify-center h-11 px-6 bg-accent text-white text-sm font-semibold rounded-lg hover:bg-[#0066CC] transition-colors"
          >
            {t("tryAgain")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center h-11 px-6 border-[1.5px] border-content-strong text-content-strong text-sm font-semibold rounded-lg hover:bg-surface-inverse hover:text-white transition-colors"
          >
            {t("goHome")}
          </Link>
        </div>
      </div>
    </div>
  )
}
