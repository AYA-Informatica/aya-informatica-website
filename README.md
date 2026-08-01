# AYA Informatica RW — Website

Marketing site for AYA Informatica RW, a Rwanda-based technology company.
Trilingual (English, French, Kinyarwanda), statically prerendered, with a
self-hosted contact pipeline.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Components | Shadcn UI (Radix primitives) |
| Icons | Lucide React |
| Animation | Framer Motion |
| i18n | next-intl 4 |
| Long-form content | MDX (`@next/mdx`) |
| Forms | React Hook Form + Zod |
| Global state | Zustand |
| Email | Nodemailer over SMTP |
| Rate limiting | Upstash Redis (in-memory fallback) |
| Captcha | Cloudflare Turnstile (optional) |
| Tests | Vitest |
| Fonts | Self-hosted Syne + DM Sans (variable) |

## Quick Start

```bash
npm install
cp .env.local.example .env.local   # then fill in the SMTP values
npm run dev                        # http://localhost:3000
```

The site runs without any environment variables — the contact form is the only
feature that needs them.

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (runs the prerender check afterwards) |
| `npm start` | Serve a production build |
| `npm run lint` | ESLint 9, flat config |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest, single run |
| `npm run test:watch` | Vitest, watch mode |
| `npm run test:coverage` | Coverage report |
| `npm run verify:prerender` | Assert every localized route is prerendered |

## Project Structure

```
src/
├── app/
│   ├── [locale]/              # every page lives under a locale segment
│   │   ├── layout.tsx         # html/body, providers, chrome, root metadata
│   │   ├── page.tsx           # home
│   │   ├── about|products|services|blog|contact/
│   │   ├── privacy|terms/     # thin wrappers around the MDX in src/content
│   │   ├── loading.tsx        # skeleton shown during navigation
│   │   ├── error.tsx
│   │   └── not-found.tsx
│   ├── api/contact/route.ts   # contact form endpoint
│   ├── robots.ts
│   └── sitemap.ts             # every route × every locale, with hreflang
├── components/
│   ├── ui/                    # primitives (Button, Input, Skeleton, …)
│   ├── layout/                # Navbar, Footer, LanguageSwitcher
│   ├── sections/              # ContactForm, TopicTags
│   └── shared/                # Logo, PageSkeleton, JsonLd, LegalPage, …
├── content/legal/             # privacy + terms, one MDX file per locale
├── i18n/
│   ├── config.ts              # locales, default locale, display names
│   ├── routing.ts             # next-intl routing (localePrefix: "as-needed")
│   ├── navigation.ts          # locale-aware Link / router
│   ├── request.ts             # per-request locale + message loading
│   └── messages/{en,fr,rw}.json   # ALL user-facing copy
├── lib/
│   ├── constants.ts           # structural data only (ids, hrefs, ordering)
│   ├── content.ts             # merges structure + translated copy
│   ├── validations.ts         # Zod schema, shared by client and server
│   ├── mailer.ts              # Nodemailer transport + templates
│   ├── turnstile.ts           # captcha verification
│   ├── security-headers.js    # CSP + headers, shared with next.config.js
│   └── urls.ts                # canonical / hreflang URL construction
├── proxy.ts                   # CORS, rate limiting, headers, locale routing
└── mdx-components.tsx         # styling for MDX content
```

## Editing Content

**No TypeScript required for copy changes.**

- **Page and component copy** lives in `src/i18n/messages/{en,fr,rw}.json`.
  Edit the string, save. `src/lib/constants.ts` holds only structural data —
  ids, hrefs, ordering, status flags — and `src/lib/content.ts` merges the two.
- **Privacy policy and terms** live in `src/content/legal/*.mdx` and are written
  as ordinary Markdown.

A test enforces that all three catalogues stay in step. Adding a key to
`en.json` without adding it to `fr.json` and `rw.json` fails `npm test`, as does
an empty value, a mismatched array length, or a dropped `{placeholder}`.

### Adding a locale

1. Add the code to `locales` and `localeNames` in `src/i18n/config.ts`.
2. Copy `src/i18n/messages/en.json` to `<code>.json` and translate it.
3. Add `src/content/legal/privacy.<code>.mdx` and `terms.<code>.mdx`, then
   register them in the `CONTENT` maps in the privacy and terms pages.

Routing, the language switcher, the sitemap, and hreflang all derive from
`config.ts` and need no further changes.

## Routing and Locales

`localePrefix` is `"as-needed"`, so the default locale is unprefixed:

| Locale | Home | About |
|---|---|---|
| English | `/` | `/about` |
| French | `/fr` | `/fr/about` |
| Kinyarwanda | `/rw` | `/rw/about` |

This is deliberate: the English URLs were already indexed, and prefixing them to
`/en/*` would have invalidated that.

## Contact Form

Self-hosted over SMTP — no third-party form service.

### Minimum configuration

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=you@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM="AYA Informatica RW" <you@gmail.com>
CONTACT_TO=you@gmail.com
```

For Gmail, enable 2FA and create an App Password at
[myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords).
Outlook (`smtp-mail.outlook.com`), Zoho (`smtp.zoho.com`) and Resend
(`smtp.resend.com`) all work the same way.

### Optional

| Variable | Effect if unset |
|---|---|
| `UPSTASH_REDIS_REST_URL` + `_TOKEN` | Rate limiting falls back to an in-memory store that resets on every cold start — effectively off in production |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` + `TURNSTILE_SECRET_KEY` | Captcha is disabled. **Set both or neither** — the secret alone would make the server demand a token the browser has no widget to produce |
| `SMTP_FALLBACK_*` | No fallback transport if the primary SMTP host fails |

See `.env.local.example` for the full annotated list.

### Protections in place

Honeypot field, IP rate limiting (5/min on the contact endpoint), Zod
validation shared by client and server, HTML escaping and CR/LF stripping in the
email templates, an Origin requirement on state-changing requests, and optional
Turnstile.

## Testing

```bash
npm test
```

87 tests covering the Zod schema (including sanitization ordering), the mailer
(HTML escaping, header injection, transport pooling), Turnstile (timeouts and
fail-open behaviour), the contact route handler, the CSP, and message-catalogue
parity.

## Deployment

Deploys to Vercel; `vercel.json` sets the build command, region and
`NEXT_PUBLIC_SITE_URL`.

```bash
npm run build   # also runs the prerender check
```

`NEXT_PUBLIC_SITE_URL` matters more than it looks: it drives the CORS
allowlist, canonical URLs, hreflang alternates and the sitemap. If it does not
match the domain the site is actually served from, the contact form will be
rejected by its own CORS check.

## Gotchas

**Files that cannot call `setRequestLocale` must be Client Components.**
`loading.tsx`, `error.tsx` and `not-found.tsx` are never passed `params`. If one
of them uses `useTranslations` as a Server Component, next-intl resolves the
locale from the request, and that single read opts *every* localized route out
of static prerendering. This has happened once; `npm run build` now fails if it
recurs.

**`next build` does not fail when prerendering breaks.** It prints
"Generating static pages (29/29)" and exits 0 whether or not the pages reach the
prerender manifest. `scripts/check-prerender.mjs` is the actual signal, and runs
automatically as a `postbuild` step.

**The security headers have two sources.** `src/lib/security-headers.js` feeds
both `next.config.js` and the proxy. `vercel.json` separately re-declares three
of them; the values currently agree, but that copy can drift.

**Regenerating the logo.** `public/logo.png` and `logo-white.png` are derived
from a bare-wordmark export, not from the favicons. The app icons are a circular
badge, which is the wrong shape for the header and whose alpha mask would render
the white variant as a solid disc.

## Contact

AYA Informatica RW · Kigali, Rwanda
📧 ay.company.andy@gmail.com
📱 +250 787 891 746
