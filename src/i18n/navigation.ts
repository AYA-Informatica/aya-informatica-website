import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

/**
 * Locale-aware navigation primitives.
 *
 * Components must import `Link` from here rather than from `next/link` so that
 * internal hrefs automatically carry the active locale prefix.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
