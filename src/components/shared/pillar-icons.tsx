import type { ReactNode } from "react"

/**
 * Icons for the home-page pillar cards, keyed by the pillar id in
 * PILLAR_META. Kept out of the content layer because they are presentation,
 * not copy — nothing here needs translating.
 */
export const PILLAR_ICONS: Record<string, ReactNode> = {
  platform: (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="16" y="2" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <rect x="2" y="16" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 21h6M21 16v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  intelligent: (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <circle cx="14" cy="14" r="12" stroke="currentColor" strokeWidth="2" />
      <path
        d="M9 14l3.5 3.5L19 10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  solutions: (
    <svg width="22" height="22" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M4 22V10l10-6 10 6v12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <rect x="10" y="14" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
}
