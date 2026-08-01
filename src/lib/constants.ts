import type { NavLink } from "@/types"

/**
 * Structural data only.
 *
 * Anything a visitor reads — names, taglines, descriptions, feature lists —
 * lives in src/i18n/messages/{locale}.json and is merged in by src/lib/content.ts.
 * What stays here is the data that is really code: ids, hrefs, ordering, status
 * flags and the contact details. That split is what lets copy be edited (and
 * translated) without touching TypeScript.
 */

// Visible labels come from the `nav` message namespace.
export const NAV_LINKS: NavLink[] = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/products", key: "products" },
  { href: "/services", key: "services" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
]

/** Product ordering and lifecycle status. Copy: `content.products.<id>`. */
export const PRODUCT_META = [
  { id: "ray", status: "active" },
  { id: "humura", status: "upcoming" },
] as const

/** Service pillars. Copy: `content.services.<id>`. */
export const SERVICE_META = [
  { id: "platform", step: "01" },
  { id: "intelligent", step: "02" },
  { id: "solutions", step: "03" },
] as const

/** Roadmap steps. Copy: `content.roadmap.<id>`. */
export const ROADMAP_META = [
  { id: "launch", step: "01" },
  { id: "expand", step: "02" },
  { id: "humura", step: "03" },
  { id: "ecosystem", step: "04" },
] as const

/** Headline figures. The values are data; the labels are copy. */
export const STATS_META = [
  { id: "pillars", value: "3" },
  { id: "platforms", value: "2" },
  { id: "founded", value: "2024" },
  { id: "countries", value: "54" },
] as const

/** Build philosophy items. Copy: `content.approach.<id>`. */
export const APPROACH_META = [
  { id: "userCentered", num: "01" },
  { id: "speed", num: "02" },
  { id: "scalability", num: "03" },
  { id: "trust", num: "04" },
] as const

/** Testimonials. Copy: `content.testimonials.<id>`. */
export const TESTIMONIAL_META = [
  { id: "jeanPierre" },
  { id: "diane" },
  { id: "patrick" },
] as const

/** Home-page pillar cards. Copy: `content.pillars.<id>`. */
export const PILLAR_META = [
  { id: "platform", href: "/services#svc-platform" },
  { id: "intelligent", href: "/services#svc-intelligent" },
  { id: "solutions", href: "/services#svc-solutions" },
] as const

export const CONTACT_INFO = {
  email: "ay.company.andy@gmail.com",
  phone: "+250 787 891 746",
  location: "Kigali, Rwanda",
}

/**
 * Contact form subjects. The `value` is the wire format validated by the Zod
 * schema and must not change; the label comes from `content.contactSubjects`.
 */
export const CONTACT_SUBJECTS = [
  { value: "partnership" },
  { value: "ray-access" },
  { value: "humura" },
  { value: "services" },
  { value: "investment" },
  { value: "other" },
] as const
