"use client"

import { useEffect, useRef, useState } from "react"
import { useTranslations } from "next-intl"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, Download, Smartphone } from "lucide-react"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// Hosted on Vercel Blob (store: ray-downloads, project: aya-informatica) —
// not committed to the repo, since GitHub hard-rejects any file over 100 MB
// and the APK is ~118 MB. This URL is permanent; it does not expire the way
// an EAS build-artifact URL would.
//
// To publish a new build: download the APK from a fresh `eas build`, then
//   npx vercel blob put <path-to-apk> --pathname ray-markets.apk \
//     --access public --rw-token <BLOB_READ_WRITE_TOKEN from .env.local>
// Vercel Blob does not support overwriting a pathname in place, so this
// produces a new URL each time (it appends a random suffix regardless of
// --add-random-suffix) — update the constant below to match.
//
// Built from RAY-Mobile commit a638d6a (EAS build 30741939, 2026-08-06).
const DOWNLOAD_URL = "https://qqwe5gualahgrnd8.public.blob.vercel-storage.com/ray-markets-eIjygCxfvIpRfqRaVPQhY6kA7jWUuA.apk"

/**
 * "Download App" trigger with a panel offering three routes: the real,
 * working APK download (see DOWNLOAD_URL above for hosting caveats), and
 * Play Store / App Store, which are not live yet — RAY-Mobile has no store
 * listing on either platform, tracked separately in that repo's own
 * checklist. Those two route to the existing "RAY Markets Early Access"
 * contact subject rather than dead-ending, so they're still useful before
 * the real badges exist. Swap them for real store links the moment those
 * listings go live; nothing else here changes.
 */
export function DownloadAppMenu({
  size = "lg",
  className,
}: {
  size?: "default" | "sm" | "lg"
  className?: string
}) {
  const t = useTranslations("products")
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", onPointerDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div ref={rootRef} className={cn("relative inline-block", className)}>
      <Button
        type="button"
        size={size}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Download size={15} aria-hidden="true" />
        {t("downloadApp")}
        <ChevronDown
          size={15}
          aria-hidden="true"
          className={cn("transition-transform", open && "rotate-180")}
        />
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={t("downloadApp")}
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-50 mt-2 w-[min(90vw,380px)] rounded-xl border border-border-subtle bg-surface-raised p-3 shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          >
            {/* Direct download — the only real, working option today */}
            <a
              role="menuitem"
              href={DOWNLOAD_URL}
              download
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg p-3 hover:bg-surface transition-colors"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Smartphone size={18} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-content-strong">{t("downloadDirect")}</p>
                <p className="text-xs text-content-muted">{t("downloadDirectSub")}</p>
              </div>
            </a>

            <div className="my-2 h-px bg-border-subtle" aria-hidden="true" />

            {/* Store badges — not live yet, route to the early-access contact subject */}
            <Link
              role="menuitem"
              href="/contact?subject=ray-access"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg p-3 opacity-60 hover:opacity-100 hover:bg-surface transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-content/8 text-content-muted">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M3 20.5V3.5c0-.5.3-1 .8-1.2l10.6 9.7-10.6 9.7c-.5-.2-.8-.7-.8-1.2ZM17 12l3.3-1.9c.8-.5.8-1.7 0-2.2L17 6l-2.9 3 2.9 3ZM13.4 12.7 4.3 21.4l9.4-5.4-.3-3.3ZM13.4 11.3l.3-3.3-9.4-5.4 9.1 8.7Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-content-strong">{t("downloadPlayStore")}</p>
              </div>
              <Badge variant="ghost" className="shrink-0">{t("downloadComingSoon")}</Badge>
            </Link>

            <Link
              role="menuitem"
              href="/contact?subject=ray-access"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-lg p-3 opacity-60 hover:opacity-100 hover:bg-surface transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-content/8 text-content-muted">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
                  <path d="M16.5 2c.1 1.2-.4 2.4-1.1 3.3-.7.9-1.9 1.6-3 1.5-.1-1.2.5-2.4 1.2-3.2.8-.9 2.1-1.5 2.9-1.6ZM20.6 17.1c-.5 1.2-.8 1.7-1.5 2.7-1 1.4-2.3 3.2-4 3.2-1.5 0-1.9-.9-3.9-.9s-2.5.9-3.9.9c-1.7 0-2.9-1.6-3.9-3-2.7-3.8-3-8.3-1.3-10.7 1.2-1.7 3-2.7 4.8-2.7 1.8 0 2.9 1 4.4 1 1.4 0 2.3-1 4.4-1 1.6 0 3.3.9 4.5 2.4-4 2.2-3.3 7.8.4 9.1Z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-content-strong">{t("downloadAppStore")}</p>
              </div>
              <Badge variant="ghost" className="shrink-0">{t("downloadComingSoon")}</Badge>
            </Link>

            <p className="mt-2 px-3 text-[0.7rem] leading-relaxed text-content-muted">
              {t("downloadInstructions")}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
