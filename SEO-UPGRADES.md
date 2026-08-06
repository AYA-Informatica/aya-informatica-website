# AYA Informatica RW — SEO Upgrade Plan

Last updated: August 2025

Keyword targeting lives in `KEYWORDS.md`.

---

## Current SEO State

**What's already in place:**
- Per-page `<title>` with `%s | AYA Informatica RW` template
- OpenGraph + Twitter Card tags on every page
- Canonical URLs set on all pages
- `robots.ts` auto-generating `/robots.txt` (disallows `/api/`)
- `sitemap.ts` auto-generating `/sitemap.xml` with priorities
- JSON-LD: Organization + WebSite + BreadcrumbList schemas
- `sameAs` social profile references
- Self-hosted fonts (no render-blocking Google Fonts)
- `max-image-preview: large`, `max-snippet: -1` for GoogleBot
- Static pre-rendering for all 24 localized routes, enforced by a postbuild
  check (`scripts/check-prerender.mjs`) that fails the build if it regresses
- Trilingual routing (EN/FR/RW) with a dynamic `<html lang>`, `hreflang`
  alternates on every page, and a sitemap covering every route in every locale
- Company logo rendered through `next/Image` with alt text and reserved
  dimensions

**What's missing — ranked by SEO impact:**

---

## Tier 1 — High Impact, Do First

### 1. Write Real Blog Content
**Impact:** Highest possible SEO lever  
**Current state:** 3 placeholder posts with no content pages  
**Why it matters:** Google ranks pages with unique, substantive content. A corporate site with 8 static pages has an extremely low ceiling for organic traffic. Blog content targeting long-tail keywords is how small companies compete.

**Action items:**
- Create actual blog post pages (individual `/blog/[slug]` routes)
- Write 5-10 articles targeting keywords like:
  - "mobile marketplace Rwanda"
  - "buying and selling phones Kigali"
  - "mental health apps Africa"
  - "digital commerce East Africa"
  - "Rwanda tech startup ecosystem"
  - "mobile-first design for African markets"
- Each post: 800-1500 words, unique `<title>`, unique `meta description`, one focus keyword
- Add `BlogPosting` JSON-LD schema to each post (`headline`, `datePublished`, `author`, `image`)
- Internal link from blog posts back to product/service pages

### 2. Add Unique, Descriptive Meta Descriptions
**Impact:** Directly controls search result click-through rate  
**Current state:** Descriptions exist but are generic and overlapping

**Problems found:**
- Homepage and about page descriptions both say "Rwanda-based technology company building scalable digital platforms"
- Products and services descriptions overlap in messaging
- No description uses a call-to-action or differentiator

**Action items:**
- Homepage: focus on brand promise + location — "AYA Informatica RW builds digital platforms from Kigali, Rwanda. Explore RAY Markets marketplace and Humura wellness — mobile-first products for Africa."
- Products: lead with product names — "RAY Markets: Rwanda's mobile marketplace for phones & electronics. Humura: Africa's upcoming mental wellness platform. Try them today."
- Services: lead with value prop — "End-to-end platform development, intelligent systems, and custom software for businesses scaling across Africa. Based in Kigali."
- About: focus on team/story — "Meet the team behind AYA Informatica RW. Founded in Kigali in 2024, we're builders, engineers, and thinkers creating Africa's digital infrastructure."
- Contact: include response time — "Contact AYA Informatica RW — partnerships, early access, investment. Based in Kigali, Rwanda. We respond within 24 hours."
- Keep each under 155 characters

### 3. ~~Fix the `<html lang>` for i18n~~ — DONE

`<html lang>` is set from the active locale, and every page emits `hreflang`
alternates for all three locales. The sitemap lists each route once per locale
with `alternates.languages`. `localePrefix` is `"as-needed"`, so English stays
unprefixed and its existing indexed URLs were preserved.

Still outstanding: an `x-default` alternate is not emitted.

### 4. Add Real Images with Alt Text — PARTIALLY DONE
**Impact:** Image search is a major traffic source; alt text feeds page relevance  
**Current state:** The company logo now renders through `next/Image` with alt
text and intrinsic dimensions (so it reserves layout space and does not cause
CLS). There are still no photographs, product screenshots or team images — the
phone mockup on the products page is CSS.  

**Action items:**
- Add product screenshots (RAY Markets app mockups, Humura wireframes)
- Add team photos on about page
- Use `next/Image` with descriptive `alt` text containing target keywords:
  - `alt="RAY Markets app showing phone listings in Kigali, Rwanda"`
  - `alt="AYA Informatica RW team in Kigali office"`
- Add `width`/`height` to prevent CLS (Core Web Vitals)
- Create WebP versions with PNG fallback

---

## Tier 2 — Medium Impact

### 5. Add `SoftwareApplication` JSON-LD for RAY Markets
**Impact:** Enables rich results in Google for app searches  
**Current state:** No product-specific structured data  

**Action items:**
- Add schema to products page:
  ```json
  {
    "@type": "SoftwareApplication",
    "name": "RAY Markets",
    "operatingSystem": "Android, iOS",
    "applicationCategory": "ShoppingApplication",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "RWF" },
    "aggregateRating": { ... }
  }
  ```
- Add when app is live with real ratings

### 6. Add `FAQPage` JSON-LD
**Impact:** Can win FAQ rich snippets in search results  
**Current state:** No FAQ content or schema  

**Action items:**
- Add an FAQ section to products page or a dedicated `/faq` page
- Questions to target:
  - "How does RAY Markets work?"
  - "Is RAY Markets free to use?"
  - "How do I sell on RAY Markets?"
  - "What is Humura?"
  - "Where is AYA Informatica RW based?"
- Wrap in `FAQPage` + `Question` + `Answer` JSON-LD schema

### 7. Improve Internal Linking
**Impact:** Spreads page authority and helps Google discover content  
**Current state:** Pages link to each other via CTAs but no contextual cross-links  

**Action items:**
- Blog posts should link to relevant product/service pages with keyword-rich anchor text
- Products page should link to related blog posts
- Services page should link to case studies (when they exist)
- About page should link to products with "learn about what we're building" text
- Footer already links to all pages — good baseline

### 8. Add `lastModified` Dates That Reflect Actual Changes
**Impact:** Google uses `lastmod` in sitemap to prioritize crawling  
**Current state:** `sitemap.ts` uses `new Date()` — so every build sets every page to "today"  

**Action items:**
- Track actual last-modified dates per page
- For static pages, use the git commit date of the page file
- For blog posts, use the post's `date` field
- This signals to Google which pages actually changed vs. which are stale

### 9. Confirm Indexing in Google Search Console
**Impact:** Nothing else in this document matters if the pages are not indexed  
**Current state:** `public/google08e8e8e4b9e28b0b.html` is present and serving
200, so the property can be verified. Whether it is actively monitored — and
whether Google has actually indexed the 24 routes — cannot be determined from
the codebase.

**What the code guarantees** (verified against a production build):

- `robots.txt` allows everything except `/api/`, and declares the sitemap
- `sitemap.xml` lists all 24 URLs (8 routes × 3 locales)
- every page returns `index, follow`
- every page self-canonicals, so no locale is collapsed into another
- every page emits `hreflang` for en/fr/rw plus `x-default`

That is *indexable*. Whether it is *indexed* is a question only Search Console
can answer.

**How to check:**

1. Search Console → **Pages**. This reports how many URLs are indexed and, for
   the rest, why not. "Discovered – currently not indexed" on a new site
   usually means low crawl priority rather than a fault.
2. Search Console → **Sitemaps** → submit `https://ayainformatica.tech/sitemap.xml`.
   Confirm it reports 24 discovered URLs.
3. **URL Inspection** on a few specific pages — one English, one French, one
   Kinyarwanda — to confirm each is indexed independently rather than being
   treated as a duplicate.
4. As a rough external check, `site:ayainformatica.tech` in Google shows
   approximately what is indexed. Treat the count as indicative, not exact.
5. Also submit to **Bing Webmaster Tools** — low effort, and it feeds DuckDuckGo.

**Expect a lag.** A newly verified property on a new domain commonly takes days
to weeks before all pages appear, and the localized routes usually trail the
English ones.

### 10. Add `og:locale:alternate` for Multilingual OG
**Impact:** Facebook/LinkedIn serve the right language card to users  
**Current state:** Only `og:locale: en_US` set  

**Action items:**
- Add to root metadata:
  ```
  og:locale:alternate: fr_FR
  og:locale:alternate: rw_RW
  ```

---

## Tier 3 — Lower Impact / Long-Term

### 11. Implement Dynamic OG Images
**Impact:** Better click-through from social shares  
**Current state:** Single static `og-image.png` for all pages  

**Action items:**
- Use Next.js `ImageResponse` API (formerly `@vercel/og`) to generate per-page OG images
- Include page title + AYA branding dynamically
- Blog posts should show post title + date in the OG image

### 12. Add Schema Markup for Services
**Impact:** Can trigger service-related rich results  
**Current state:** No service-specific structured data  

**Action items:**
- Add `Service` schema for each service pillar:
  ```json
  {
    "@type": "Service",
    "name": "Platform Development",
    "provider": { "@id": "https://ayainformatica.tech/#organization" },
    "areaServed": "Africa",
    "description": "End-to-end digital platforms built to scale."
  }
  ```

### 13. Create a `/resources` or `/guides` Hub
**Impact:** Cornerstone content strategy for long-term organic growth  
**Current state:** No educational content  

**Action items:**
- "How to sell phones online in Rwanda" (targets RAY Markets' market)
- "Guide to digital commerce in East Africa"
- "Mental wellness resources for African communities" (targets Humura's market)
- These pages become link magnets and establish topical authority

### 14. Add Structured Data Testing to CI
**Impact:** Prevents broken schema from shipping  
**Current state:** No validation  

**Action items:**
- Add a build step that validates JSON-LD output against schema.org
- Use `schema-dts` package for TypeScript-safe schema definitions
- Test with Google's Rich Results Test after each deploy

### 15. Monitor Core Web Vitals
**Impact:** Google uses CWV as a ranking signal  
**Current state:** `@vercel/speed-insights` installed but no monitoring dashboard  

**Action items:**
- Review Vercel Speed Insights dashboard after deploy
- Target scores: LCP < 2.5s, FID < 100ms, CLS < 0.1
- `next/Image` is now in use with reserved dimensions, so added imagery should
  not spike CLS; LCP is still unmeasured
- Font loading could affect FCP — monitor after variable font switch
- The whole ~450-key message catalogue is serialized into every page's client
  payload, including locales the page will never render. Worth scoping per route.

### 16. Build Backlinks
**Impact:** Still the strongest ranking signal  
**Current state:** Likely zero external backlinks  

**Action items:**
- List AYA Informatica RW on Rwanda startup directories
- Submit to African tech publication lists (e.g., Disrupt Africa, TechCabal)
- Contribute guest posts to tech blogs with backlink to ayainformatica.tech
- List on Crunchbase, AngelList, ProductHunt (when RAY Markets launches)
- Engage in Kigali tech community events for press coverage

---

## Quick Reference: Current vs. Target

| SEO Element | Current | Target |
|---|---|---|
| Indexed pages | ~8 | 20+ (with blog posts) |
| Blog posts | 0 real | 10+ with keyword targeting |
| JSON-LD schemas | 3 (Org, WebSite, Breadcrumb) | 6+ (add BlogPosting, Service, FAQ) |
| Images with alt text | 1 (logo, via `next/Image`) | 15+ |
| Languages | **3 (EN, FR, RW) with hreflang** ✓ | done |
| Backlinks | ~0 | 10+ from directories/press |
| Core Web Vitals | Unmonitored | LCP <2.5s, CLS <0.1 |
| Static prerendering | 24/24 localized routes ✓ | enforced by postbuild check |
| Dynamic OG images | No (static) | Yes (per-page) |
| Search Console | Possibly inactive | Active, monitored weekly |
