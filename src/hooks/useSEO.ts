import { useEffect } from 'react'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
}

/**
 * Custom hook to set page-specific SEO meta tags
 * Updates document title and meta tags dynamically per page
 */
export function useSEO({ title, description, canonical, ogImage }: SEOProps) {
  useEffect(() => {
    // Set document title
    document.title = title

    // Set or update meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', description)

    // Set or update OG title
    let ogTitle = document.querySelector('meta[property="og:title"]')
    if (!ogTitle) {
      ogTitle = document.createElement('meta')
      ogTitle.setAttribute('property', 'og:title')
      document.head.appendChild(ogTitle)
    }
    ogTitle.setAttribute('content', title)

    // Set or update OG description
    let ogDescription = document.querySelector('meta[property="og:description"]')
    if (!ogDescription) {
      ogDescription = document.createElement('meta')
      ogDescription.setAttribute('property', 'og:description')
      document.head.appendChild(ogDescription)
    }
    ogDescription.setAttribute('content', description)

    // Set or update Twitter title
    let twitterTitle = document.querySelector('meta[name="twitter:title"]')
    if (!twitterTitle) {
      twitterTitle = document.createElement('meta')
      twitterTitle.setAttribute('name', 'twitter:title')
      document.head.appendChild(twitterTitle)
    }
    twitterTitle.setAttribute('content', title)

    // Set or update Twitter description
    let twitterDescription = document.querySelector('meta[name="twitter:description"]')
    if (!twitterDescription) {
      twitterDescription = document.createElement('meta')
      twitterDescription.setAttribute('name', 'twitter:description')
      document.head.appendChild(twitterDescription)
    }
    twitterDescription.setAttribute('content', description)

    // Set canonical URL if provided
    if (canonical) {
      let linkCanonical = document.querySelector('link[rel="canonical"]')
      if (!linkCanonical) {
        linkCanonical = document.createElement('link')
        linkCanonical.setAttribute('rel', 'canonical')
        document.head.appendChild(linkCanonical)
      }
      linkCanonical.setAttribute('href', canonical)
    }

    // Set OG URL if canonical provided
    if (canonical) {
      let ogUrl = document.querySelector('meta[property="og:url"]')
      if (!ogUrl) {
        ogUrl = document.createElement('meta')
        ogUrl.setAttribute('property', 'og:url')
        document.head.appendChild(ogUrl)
      }
      ogUrl.setAttribute('content', canonical)
    }

    // Set OG image if provided
    if (ogImage) {
      let ogImageMeta = document.querySelector('meta[property="og:image"]')
      if (!ogImageMeta) {
        ogImageMeta = document.createElement('meta')
        ogImageMeta.setAttribute('property', 'og:image')
        document.head.appendChild(ogImageMeta)
      }
      ogImageMeta.setAttribute('content', ogImage)

      let twitterImage = document.querySelector('meta[name="twitter:image"]')
      if (!twitterImage) {
        twitterImage = document.createElement('meta')
        twitterImage.setAttribute('name', 'twitter:image')
        document.head.appendChild(twitterImage)
      }
      twitterImage.setAttribute('content', ogImage)
    }
  }, [title, description, canonical, ogImage])
}
