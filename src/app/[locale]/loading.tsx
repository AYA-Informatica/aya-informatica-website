import { useTranslations } from "next-intl"
import { PageSkeleton } from "@/components/shared/page-skeleton"

/**
 * Route-level loading UI.
 *
 * Replaces the previous centred dot spinner. A spinner only communicates
 * "wait"; a skeleton shaped like the page keeps the layout stable and makes a
 * navigation feel like it has already landed.
 */
export default function Loading() {
  const t = useTranslations("common")
  return <PageSkeleton label={t("loading")} />
}
