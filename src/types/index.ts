/** Navigation link */
export interface NavLink {
  href: string
  /** Key into the `nav` message namespace — the label itself is translated. */
  key: string
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

