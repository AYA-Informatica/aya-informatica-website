# Directory Listings & Business Profiles

Everything needed to list AYA Informatica RW, in a form that can be pasted
without rewriting it each time.

**Why this is worth doing before more on-page SEO.** For
"web development companies Kigali" the top two results are TechBehemoths
*directory pages*, not any agency's own site. Outranking a directory is a
multi-year project; being listed in one puts you in front of that same searcher
this week. It is also the fastest way to make a brand name resolve at all —
searching "AYA Informatica" today returns nothing, because no external source
corroborates that the company exists.

None of this can be done from the codebase. Each item needs a login.

---

## Use exactly these values everywhere

Search engines match businesses across sources by **NAP** — name, address,
phone. Inconsistency between listings splits the signal, so vary nothing below,
not even punctuation or spacing. These are the values the site itself already
publishes, so they are the ones to match.

| Field | Value |
|---|---|
| Business name | `AYA Informatica RW` |
| Phone | `+250 787 891 746` |
| Email | `ay.company.andy@gmail.com` |
| Website | `https://www.ayainformatica.tech` |
| City | `Kigali` |
| Country | `Rwanda` |
| Founded | `2025` |

**Use the `www` form of the website.** The apex 308-redirects to it, and a
directory recording a redirecting URL is a weaker citation.

### Short description (155 chars — for fields with a tight limit)

```
AYA Informatica RW builds digital platforms from Kigali — RAY Markets,
Rwanda's mobile-first marketplace, plus custom software for African business.
```

### Long description (for fields that allow a paragraph)

```
AYA Informatica RW is a Rwanda-based technology company building digital
platforms designed for how Africa actually works. We build and operate RAY
Markets, a live mobile-first marketplace connecting buyers and sellers across
Rwanda, and Humura, an upcoming mental wellness platform. Alongside our own
products we deliver platform development, intelligent systems and custom
software for businesses modernising their operations. Based in Kigali,
building for the continent.
```

### Categories to select

Pick the closest available; directories differ in wording.

1. Software Company / Software Development
2. Web Development
3. Mobile App Development
4. IT Services & Consulting

---

## Where to list, in priority order

### 1. Google Business Profile — do this first

[business.google.com](https://business.google.com)

The single highest-return item. It is what produces the panel on the right of a
branded search, and it feeds Google Maps. Nothing else makes a brand name
resolve as quickly.

- A service-area business without a public office can hide the street address
  and set a service area of Kigali, or Rwanda, instead. An address is not
  required to be listed.
- Verification is by postcard, phone or video call depending on what Google
  offers — allow one to two weeks.
- Add the logo (`public/apple-touch-icon.png`) and the OG image
  (`public/og-image.png`).

### 2. TechBehemoths

[techbehemoths.com](https://techbehemoths.com/) → Add your company

Already ranking first for the exact queries AYA wants. A free listing appears
on those same pages.

### 3. Clutch

[clutch.co](https://clutch.co/) → Get listed

Carries weight with buyers evaluating agencies, and its profiles rank well.
Reviews are verified by interview, so ask a real client early.

### 4. GoodFirms

[goodfirms.co](https://www.goodfirms.co/)

Same category of directory as Clutch, second priority to it.

### 5. LinkedIn Company Page

Often the first result for a company name and free to create. Link it from the
site and add it to the JSON-LD `sameAs` array so the profile and the site are
explicitly connected.

### 6. Rwandan and regional directories

- [RwandaYP](https://www.rwandayp.com/)
- [Rwanda Market](http://www.rwandamarket.rw/)
- Rwanda ICT Chamber, if membership is an option

Lower domain authority than the above, but locally relevant, which is exactly
the signal that matters for "in Kigali" queries.

---

## After listing

**Reconcile the JSON-LD.** `src/components/shared/json-ld.tsx` carries a
`sameAs` array. Every profile created above should be added to it, and anything
already listed there that does not exist should be removed — a `sameAs`
pointing at a profile that is not there is a claim the site cannot support.

**Keep the citation identical.** If the phone number or business name ever
changes, it has to change in every listing at the same time, or the
inconsistency undoes the benefit.

---

## What this will not do

Directory listings make a brand *resolvable*. They will not win
"software development Kigali" on their own — that needs content and time. They
are the floor, not the ceiling, and the floor is currently missing.
