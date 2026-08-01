"use client"

import { useTranslations } from "next-intl"
import { PageSkeleton } from "@/components/shared/page-skeleton"

/**
 * Route-level loading UI.
 *
 * Replaces the previous centred dot spinner. A spinner only communicates
 * "wait"; a skeleton shaped like the page keeps the layout stable and makes a
 * navigation feel like it has already landed.
 *
 * Must stay a Client Component. `loading.tsx` is never passed `params`, so it
 * cannot call `setRequestLocale`; as a Server Component, `useTranslations`
 * would then resolve the locale from the request and opt every route out of
 * static rendering. As a Client Component it reads from the provider in the
 * layout instead, and the routes stay prerendered.
 */
export default function Loading() {
  const t = useTranslations("common")
  return <PageSkeleton label={t("loading")} />
}
