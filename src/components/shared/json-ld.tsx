/**
 * JSON-LD Structured Data
 * Injected into <head> via layout.tsx for Google rich results.
 * Two schemas:
 *   1. Organization — company identity, contact, logo
 *   2. WebSite      — enables Google Sitelinks Search Box
 */
export function JsonLd() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://ayainformatica.com/#organization",
    name: "AYA Informatica",
    url: "https://ayainformatica.com",
    logo: {
      "@type": "ImageObject",
      url: "https://ayainformatica.com/og-image.png",
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
        availableLanguage: ["English"],
      },
    ],
    sameAs: [],
    foundingLocation: {
      "@type": "Place",
      name: "Kigali, Rwanda",
    },
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://ayainformatica.com/#website",
    url: "https://ayainformatica.com",
    name: "AYA Informatica",
    description: "Building Africa's Digital Future",
    publisher: {
      "@id": "https://ayainformatica.com/#organization",
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
