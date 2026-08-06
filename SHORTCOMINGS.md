# AYA Informatica RW Website — Shortcomings Audit

Last updated: August 2025

This tracks what the site does *not* yet do. Items that have since been closed
are listed at the bottom so the history stays visible.

---

## 1. Content Gaps

### No published articles
- The blog lists three planned posts. None are written, and nothing links to an
  article, because there is no article to link to.
- The cards now say "Coming soon" and no longer carry a link affordance, so the
  page is honest about this — but it is still a section with no content.

### No product anyone can use
- RAY Markets and Humura are described at length, but there is no download, demo,
  waitlist, or beta signup.
- Every product CTA routes to `/contact`. A visitor who gets excited about RAY Markets
  reaches a contact form, not a product.

### Fabricated testimonials
- `content.testimonials` contains three quotes attributed to named people —
  "Jean-Pierre M.", "Diane U.", "Patrick K.". These are placeholders presented
  as real customer quotes.
- This is a credibility risk rather than a cosmetic one: quotes attributed to
  named individuals imply consent and provenance. They should be replaced with
  real ones or removed.

### Almost no imagery
- The company logo is now used in the site chrome (header, footer, blog card
  placeholder, ecosystem hub).
- Beyond that there are still no photographs, product screenshots, or team
  images. The phone mockup on the products page is CSS divs.

---

## 2. Business Credibility Gaps

### No team identity
- The About page lists "Founder & CEO" and "Development Team" with generic SVG
  icons — no names, photographs, bios, or profile links.

### Social profiles are asserted but not shown
- `json-ld.tsx` declares three `sameAs` profiles: `twitter.com/ayainformatica`,
  `linkedin.com/company/ayainformatica`, `github.com/ayainformatica`.
- Nothing in the UI links to them. If those accounts do not exist, the
  structured data is asserting something untrue to search engines. Either add
  the links to the footer or drop the claims.

### Aspirational stats, not achievements
- The headline figures are "3 Service Pillars", "54 African Countries to Serve".
  These are intentions. There are no user counts, downloads, revenue figures, or
  named partnerships.

---

## 3. Architecture Shortcomings

### Rate limiting is not durable in production
- `proxy.ts` uses Upstash Redis when `UPSTASH_REDIS_REST_URL` and
  `UPSTASH_REDIS_REST_TOKEN` are set, and falls back to an in-memory map when
  they are not.
- Those variables are not currently configured, so the fallback is what runs.
  It resets on every serverless cold start, which means the 5-requests-per-minute
  contact limit does not durably hold on Vercel.
- Both variables are documented in `.env.local.example`. Setting them is the fix.

### No database
- Content lives in message catalogues; contact submissions are emailed and then
  gone. There is no record, no CRM, and no way to follow up systematically.

### No authentication or admin surface
- Copy is now editable as JSON and MDX without touching TypeScript, which
  removes the need for a developer to change wording — but publishing still
  requires a commit and a deploy.

### Whole message catalogue ships to every page
- next-intl serializes all ~450 keys into each page's client payload, so the
  home page carries the Kinyarwanda legal notice and every other locale string
  it will never render. Worth scoping to per-route namespaces.

### Security headers are declared in three places
- `src/lib/security-headers.js` is the single source used by `next.config.js`
  and `src/proxy.ts`.
- `vercel.json` separately re-declares `X-Frame-Options`,
  `X-Content-Type-Options` and `Referrer-Policy`. The values currently agree, so
  nothing is broken, but it is a third copy that can drift.

---

## 4. UX Shortcomings

### Every page shares one template
- Navy hero, grid background, diagonal accent line, eyebrow, headline,
  paragraph — repeated across seven pages. Consistent, but nothing
  distinguishes products from about from services.

### Too many CTAs, all going to one place
- "Get in Touch", "Partner With Us", "Contact Us", "Start a Conversation",
  "Get Early Access" all route to `/contact`. The variety of labels suggests
  different actions that turn out to be identical.

### No differentiated user journey
- The homepage presents pillars, products, approach and testimonials without a
  narrative thread, and does not distinguish an investor from a prospective user
  from a business client.

---

## 5. Translation Status

- French and Kinyarwanda cover the full site, including the legal pages, and a
  parity test enforces that all three catalogues stay in step.
- Both translations are machine-produced and have not been reviewed by a native
  speaker. The English version of the legal documents is declared as the
  governing text.

---

## Closed since the previous audit

- **No tests** — there are now 87 across validation, the mailer, Turnstile, the
  contact route handler, the CSP, and message parity.
- **English-only site** — full locale routing for English, French and
  Kinyarwanda, with a language switcher, hreflang alternates, and a
  locale-aware sitemap.
- **Legal pages as walls of JSX** — privacy and terms are MDX, one file per
  locale, editable as prose.
- **Content hardcoded in constants.ts** — all human-readable copy now lives in
  `src/i18n/messages/*.json`, merged with structural data by `src/lib/content.ts`.
- **Logo unused in the UI** — the header, footer, blog card placeholder and
  ecosystem hub previously drew a CSS text approximation of the wordmark.
- **Spinner-only loading state** — route transitions now use skeletons shaped
  like the page.

---

## Summary

The engineering gaps that this document previously described have largely been
closed. What remains is mostly not an engineering problem: the site still does
not demonstrate that AYA Informatica RW is an operating business with shipped
products and real customers. Closing that needs content and business milestones.

The exceptions — genuine technical work still outstanding — are durable rate
limiting, the oversized client message payload, and the duplicated header
declaration in `vercel.json`.
