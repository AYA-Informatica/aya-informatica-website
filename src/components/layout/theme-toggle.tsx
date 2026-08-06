"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"
import { useTranslations } from "next-intl"
import { Monitor, Moon, Sun } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Reports false during SSR and the hydrating render, true afterwards.
 *
 * `useSyncExternalStore` with a server snapshot is the intended primitive for
 * this. The usual `useState` + `useEffect(() => setMounted(true))` does the same
 * job but schedules a second render from inside an effect, which the React
 * Compiler correctly flags as a cascading render.
 */
const subscribe = () => () => {}
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )

/** Cycle order. "system" last so a visitor can always get back to their OS setting. */
const ORDER = ["light", "dark", "system"] as const
type ThemeName = (typeof ORDER)[number]

const ICONS: Record<ThemeName, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
}

/**
 * Cycles light → dark → system.
 *
 * A single cycling control rather than three buttons: the navbar already holds
 * the logo, six links, the language switcher and a CTA, and three more targets
 * crowd it on smaller viewports.
 *
 * The hydration guard is required rather than defensive. On the server the
 * resolved theme is unknowable, so rendering the real icon during SSR would
 * disagree with what the client renders after reading localStorage, and React
 * would report a hydration mismatch. Until hydrated this renders a neutral
 * placeholder of identical size, so nothing shifts when the icon appears.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const t = useTranslations("theme")
  const { theme, setTheme } = useTheme()
  const mounted = useHydrated()

  const current: ThemeName =
    mounted && ORDER.includes(theme as ThemeName) ? (theme as ThemeName) : "system"
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]
  const Icon = ICONS[current]

  const base = cn(
    "inline-flex items-center justify-center w-7 h-7 rounded",
    "text-white/45 hover:text-white hover:bg-white/10 transition-colors",
    className
  )

  if (!mounted) {
    // Same footprint as the button, so the navbar does not reflow on mount.
    return <span className={base} aria-hidden="true" />
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className={base}
      // Announces the current state and what pressing it will do, since the
      // icon alone cannot convey either.
      aria-label={t("toggle", { current: t(current), next: t(next) })}
      title={t("toggle", { current: t(current), next: t(next) })}
    >
      <Icon size={15} aria-hidden="true" />
    </button>
  )
}
