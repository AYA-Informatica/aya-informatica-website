const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ayainformatica.tech"

interface BreadcrumbItem {
  name: string
  href: string
}

export function BreadcrumbJsonLd({ items }: { readonly items: readonly BreadcrumbItem[] }) {
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${BASE_URL}${item.href}`,
      })),
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
    />
  )
}

export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: "AYA Informatica",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description:
      "Rwanda-based technology company building scalable digital platforms that connect people, businesses, and opportunities across Africa.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Kigali",
      addressCountry: "RW",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+250787891746",
        email: "ay.company.andy@gmail.com",
        contactType: "customer service",
        areaServed: "Africa",
        availableLanguage: ["English", "French", "Kinyarwanda"],
      },
    ],
    sameAs: [
      "https://twitter.com/ayainformatica",
      "https://linkedin.com/company/ayainformatica",
      "https://github.com/ayainformatica",
    ],
    foundingDate: "2024",
    foundingLocation: {
      "@type": "Place",
      name: "Kigali, Rwanda",
    },
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    url: BASE_URL,
    name: "AYA Informatica",
    description: "Building Africa's Digital Future",
    publisher: {
      "@id": `${BASE_URL}/#organization`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
