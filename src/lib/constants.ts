import type { NavLink, Product, ServiceItem } from "@/types"

export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

export const PRODUCTS: Product[] = [
  {
    id: "ray",
    name: "RAY",
    badge: "🔥 Flagship Platform",
    tagline: "Rwanda's mobile-first marketplace for buying and selling.",
    status: "active",
    description:
      "RAY is a mobile-first marketplace designed to simplify buying and selling in Rwanda, starting with phones and electronics. Built on trust, speed, and accessibility — RAY connects buyers and sellers directly and transparently.",
    features: [
      "Post items quickly",
      "Connect directly with buyers or sellers",
      "Negotiate prices transparently",
      "Access a wider, more active market",
    ],
  },
  {
    id: "humura",
    name: "Humura",
    badge: "🧠 Upcoming Platform",
    tagline: "Mental wellness and emotional support — for Africa.",
    status: "upcoming",
    description:
      "Humura is a digital platform focused on mental wellness and emotional support. It provides safe and anonymous access to support, human-centered experiences, and a trusted digital environment for personal wellbeing.",
    features: [
      "Safe & anonymous access to support",
      "Human-centered UX design",
      "Trusted digital environment",
      "Personal wellbeing focus",
    ],
  },
]

export const SERVICES: ServiceItem[] = [
  {
    id: "platform",
    step: "01",
    title: "Platform Development",
    tagline: "End-to-end digital platforms built to scale.",
    description:
      "We design and build scalable digital platforms from the ground up. Whether you need a marketplace, a service directory, or a transactional platform, we architect it for reliability, performance, and long-term growth.",
    capabilities: [
      "Mobile-first application development",
      "API design and backend infrastructure",
      "Marketplace and commerce platforms",
      "Real-time communication systems",
      "Third-party integrations and payments",
      "Cloud infrastructure and DevOps",
    ],
  },
  {
    id: "intelligent",
    step: "02",
    title: "Intelligent Systems",
    tagline: "Data-driven systems that make smarter decisions.",
    description:
      "We design systems that leverage data and modern technologies to improve efficiency, decision-making, and user experience — from recommendation engines to analytics dashboards.",
    capabilities: [
      "Data pipeline design and engineering",
      "Analytics dashboards and reporting",
      "Recommendation and search systems",
      "Process automation and workflow tools",
      "Performance monitoring systems",
      "User behavior and engagement analysis",
    ],
  },
  {
    id: "solutions",
    step: "03",
    title: "Digital Solutions",
    tagline: "Tailored software for businesses ready to modernize.",
    description:
      "We provide customized software solutions for businesses that want to digitize, streamline, and scale their operations. Purposeful software — not generic tools.",
    capabilities: [
      "Custom business software development",
      "Legacy system modernization",
      "Web and mobile application development",
      "CMS and content platform development",
      "ERP and operational tooling",
      "Ongoing support and maintenance",
    ],
  },
]

export const ROADMAP = [
  {
    step: "01",
    title: "Launch & Scale RAY in Kigali",
    desc: "Establish Rwanda's go-to mobile marketplace for phones and electronics.",
  },
  {
    step: "02",
    title: "Expand Categories & User Base",
    desc: "Broaden the marketplace to new product categories and grow the active community.",
  },
  {
    step: "03",
    title: "Introduce Humura Platform",
    desc: "Launch our mental wellness and emotional support platform for Africa.",
  },
  {
    step: "04",
    title: "Build an Integrated Ecosystem",
    desc: "Connect our platforms into a unified digital ecosystem powering everyday African life.",
  },
]

export const STATS = [
  { value: "3", label: "Service Pillars" },
  { value: "2", label: "Platforms in Development" },
  { value: "2024", label: "Founded in Kigali" },
  { value: "54", label: "African Countries to Serve" },
]

export const APPROACH = [
  {
    num: "01",
    title: "User-Centered Design",
    desc: "We build for real people with real needs — not assumptions.",
  },
  {
    num: "02",
    title: "Speed & Execution",
    desc: "We prioritize rapid development and continuous improvement.",
  },
  {
    num: "03",
    title: "Scalability First",
    desc: "Every system is architected to grow with demand from day one.",
  },
  {
    num: "04",
    title: "Trust & Safety",
    desc: "Trust mechanisms are integrated into every product from the start.",
  },
]

export const TESTIMONIALS = [
  {
    quote: "AYA Informatica understands what it means to build for Africa — not just technically, but culturally. Their approach is refreshing.",
    name: "Jean-Pierre M.",
    role: "Tech Entrepreneur, Kigali",
  },
  {
    quote: "RAY is exactly what the market needed — a trustworthy, mobile-first platform that makes buying and selling simple and transparent.",
    name: "Diane U.",
    role: "Early Access User",
  },
  {
    quote: "Working with AYA's team showed us what product-driven development looks like. They move fast without cutting corners.",
    name: "Patrick K.",
    role: "Business Partner",
  },
]

export const CONTACT_INFO = {
  email: "ay.company.andy@gmail.com",
  phone: "+250 787 891 746",
  location: "Kigali, Rwanda",
}

export const CONTACT_SUBJECTS = [
  { value: "partnership", label: "Partnership" },
  { value: "ray-access", label: "RAY Early Access" },
  { value: "humura", label: "Humura Platform" },
  { value: "services", label: "Service Inquiry" },
  { value: "investment", label: "Investment" },
  { value: "other", label: "General / Other" },
]
