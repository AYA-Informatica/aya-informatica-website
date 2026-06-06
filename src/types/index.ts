/** Navigation link */
export interface NavLink {
  href: string
  label: string
}

/** Service pillar */
export interface ServiceItem {
  id: string
  step: string
  title: string
  tagline: string
  description: string
  capabilities: string[]
}

/** Product */
export interface Product {
  id: string
  name: string
  tagline: string
  description: string
  features: string[]
  status: "active" | "upcoming"
  badge: string
}

/** Contact form schema values (mirrored from Zod schema) */
export interface ContactFormValues {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}
