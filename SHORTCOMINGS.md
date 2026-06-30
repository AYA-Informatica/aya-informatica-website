# AYA Informatica Website — Shortcomings Audit

Last updated: June 2025

---

## 1. Content Gaps

### No Real Content
- Blog has 3 placeholder posts that link nowhere — no actual articles exist
- Testimonials are fabricated placeholders ("Jean-Pierre M.", "Diane U.") — no real user quotes
- No case studies, press mentions, or real-world success stories
- Site reads polished but empty — visitors will notice immediately

### No Product You Can Actually Use
- RAY and Humura are described extensively but there's no app download link, no demo, no waitlist signup, no beta access form
- Every CTA button ("Get Early Access", "Discover RAY", "Stay Updated on Humura") routes to the generic contact page
- A visitor excited about RAY hits a dead end with no product to try

### No Images Anywhere
- Entire site is text + inline SVG icons + CSS-generated shapes
- No team photos, no product screenshots, no lifestyle imagery
- Phone mockup on products page is CSS divs pretending to be a phone
- Makes the site feel like a template, not a real company

---

## 2. Business Credibility Gaps

### No Team Identity
- About page shows "Founder & CEO" and "Development Team" with generic SVG icons
- No names, no photos, no LinkedIn profiles, no bios
- For a company seeking partnerships and investment, anonymity erodes trust

### No External Validation
- No press logos or "featured in" section
- No partner badges or client logos
- No awards or recognitions
- Site is entirely self-referential — AYA only talks about AYA

### Aspirational Stats, Not Achievements
- Stats section shows "3 Service Pillars", "54 African Countries to Serve"
- These are goals, not traction metrics
- No user counts, download numbers, revenue figures, or named partnerships
- "Founded 2024" with nothing to show for the time elapsed

### No Social Media Presence
- JSON-LD structured data references Twitter, LinkedIn, GitHub profiles
- No social links visible anywhere in the footer or site UI
- If those profiles don't actually exist, the structured data misleads search engines

---

## 3. Architecture Shortcomings

### No Database
- All content hardcoded in `src/lib/constants.ts`
- Contact form submissions are emailed then gone — no record, no CRM, no lead tracking
- No way to follow up systematically on inquiries

### No Authentication or Admin Panel
- Blog posts require a code deploy to create or update
- Content changes require a developer
- Will bottleneck the team as soon as content needs grow

### No Tests
- Zero test files in the entire codebase
- No unit tests, no integration tests, no e2e tests
- Any change could break something silently

### Rate Limiting Still Fragile
- Upstash Redis is wired up but only works if env vars are configured
- Without `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN`, falls back to in-memory
- In-memory resets on every Vercel cold start — effectively disabled in production without Redis

---

## 4. UX Shortcomings

### Every Page Looks the Same
- Navy hero with grid background + diagonal accent line + eyebrow text + headline + paragraph
- Seven pages, identical layout pattern
- Consistent but monotonous — nothing visually distinguishes products from about from services

### Too Many CTAs, Not Enough Specificity
- "Get in Touch", "Partner With Us", "Contact Us", "Start a Conversation", "Get Early Access"
- All route to `/contact`
- Variety of labels creates an illusion of different actions that all do the same thing

### No Clear User Journey
- Homepage presents pillars, products, approach, testimonials, CTA — but no narrative thread
- No differentiation for visitor types (investor vs. potential user vs. business client)
- No guided path to a specific outcome

### Legal Pages Are Walls of JSX
- Privacy policy and terms are hundreds of lines of hardcoded React components
- Updating a paragraph requires touching source code
- Should be markdown, MDX, or CMS-managed

---

## 5. Internationalization Gap

### Single Language Despite "Built for Africa"
- i18n foundation exists (next-intl + FR/Kinyarwanda message files)
- Zero pages actually consume the translations
- Site is English-only
- For a company targeting 54 African countries, this directly undermines the positioning

---

## Summary

The codebase is technically strong — clean architecture, solid security, good accessibility foundation. The gap is not engineering quality. The gap is that the site doesn't prove AYA Informatica is a real, operating business with real products and real customers. Closing that gap requires content and business milestones, not more code.
