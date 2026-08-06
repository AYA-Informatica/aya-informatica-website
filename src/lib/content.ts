/**
 * Content layer.
 *
 * Merges the structural data in constants.ts with the translated copy in
 * src/i18n/messages/{locale}.json. Pages consume content exclusively through
 * these hooks, so a copy change is a JSON edit and a locale is a new JSON file
 * — neither requires touching a component.
 *
 * These are hooks rather than plain functions because `useTranslations` resolves
 * the active locale from context. next-intl supports it in both Server and
 * Client Components, so pages can stay server-rendered.
 *
 * To move to a CMS later, replace the `t(...)` lookups here with API calls; the
 * page components do not change.
 */

import { useTranslations } from "next-intl"
import {
  APPROACH_META,
  CONTACT_SUBJECTS,
  PILLAR_META,
  PRODUCT_META,
  ROADMAP_META,
  SERVICE_META,
  STATS_META,
  TESTIMONIAL_META,
} from "./constants"

export function useProducts() {
  const t = useTranslations("content.products")
  return PRODUCT_META.map(({ id, status, liveUrl }) => ({
    id,
    status,
    liveUrl: liveUrl as string | null,
    name: t(`${id}.name`),
    badge: t(`${id}.badge`),
    tagline: t(`${id}.tagline`),
    description: t(`${id}.description`),
    features: t.raw(`${id}.features`) as string[],
    cta: t(`${id}.cta`),
  }))
}

export function useServices() {
  const t = useTranslations("content.services")
  return SERVICE_META.map(({ id, step }) => ({
    id,
    step,
    title: t(`${id}.title`),
    tagline: t(`${id}.tagline`),
    description: t(`${id}.description`),
    capabilities: t.raw(`${id}.capabilities`) as string[],
  }))
}

export function useRoadmap() {
  const t = useTranslations("content.roadmap")
  return ROADMAP_META.map(({ id, step }) => ({
    id,
    step,
    title: t(`${id}.title`),
    desc: t(`${id}.desc`),
  }))
}

export function useStats() {
  const t = useTranslations("content.stats")
  return STATS_META.map(({ id, value }) => ({
    id,
    value,
    label: t(`${id}.label`),
  }))
}

export function useApproach() {
  const t = useTranslations("content.approach")
  return APPROACH_META.map(({ id, num }) => ({
    id,
    num,
    title: t(`${id}.title`),
    desc: t(`${id}.desc`),
  }))
}

export function useTestimonials() {
  const t = useTranslations("content.testimonials")
  return TESTIMONIAL_META.map(({ id }) => ({
    id,
    quote: t(`${id}.quote`),
    name: t(`${id}.name`),
    role: t(`${id}.role`),
  }))
}

export function usePillars() {
  const t = useTranslations("content.pillars")
  return PILLAR_META.map(({ id, href }) => ({
    id,
    href,
    title: t(`${id}.title`),
    desc: t(`${id}.desc`),
  }))
}

export function useContactSubjects() {
  const t = useTranslations("content.contactSubjects")
  return CONTACT_SUBJECTS.map(({ value }) => ({
    value,
    label: t(value),
  }))
}
