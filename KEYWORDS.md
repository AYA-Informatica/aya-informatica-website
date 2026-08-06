# AYA Informatica RW — Keyword Strategy

Last updated: August 2026

---

## Two things block indexing right now

Both were found by auditing the live site rather than the code, and neither is
about keywords. Fix them before anything below matters.

### 1. Every URL you submit to Google redirects

Vercel serves `www.ayainformatica.tech` and 308s the apex to it. Every ranking
signal the site emits names the **apex**:

| Signal | Value |
|---|---|
| `<link rel="canonical">` on all 8 routes | `https://ayainformatica.tech/…` |
| `robots.txt` → `Host:` | `https://ayainformatica.tech` |
| All 24 `<loc>` entries in `sitemap.xml` | `https://ayainformatica.tech/…` |
| Every `hreflang` alternate | `https://ayainformatica.tech/…` |
| JSON-LD `@id` and `url` | `https://ayainformatica.tech` |

So Google is told to index the apex, follows a redirect to `www`, and finds a
page whose canonical points back at the URL it just came from. That is a
circular signal, and it costs crawl budget and consolidation on every page.

**The fix is one setting, no code.** Vercel → Settings → Domains → make
`ayainformatica.tech` the primary domain instead of `www`. Every signal above
is already correct for the apex, so nothing else has to change. Doing it the
other way — changing `NEXT_PUBLIC_SITE_URL` to `www` — also works but rewrites
all 24 canonical URLs, which is a worse trade for URLs already indexed.

### 2. The page titles carried no keywords

Until August 2026 they rendered as `About | AYA Informatica RW`,
`Products | AYA Informatica RW`, and so on. The `<title>` is the strongest
on-page signal there is, and every page was spending it on a brand name with no
search volume — so each page was competing only for its own name.

Now fixed in `src/i18n/messages/*.json` under `<page>.metaTitle`: they name the
service and the place, in all three locales, within the ~60 character limit.

---

## Read this first

**Keywords are still not the main bottleneck.** The site is technically sound —
every route is prerendered, indexable, and carries correct `hreflang`. What it
does not have is content or links, and those are what actually decide rankings.

Three things determine whether a page ranks, roughly in order:

1. **Content that matches what someone typed.** The site has 8 pages and no
   articles. There is nothing to rank for most queries because no page answers
   them.
2. **Links from other sites.** Currently close to zero. This is the slowest
   lever and the one no amount of on-page work substitutes for.
3. **Technical health.** Already done.

Choosing better keywords without (1) changes very little. The map below is
therefore written as *"which page must exist to win this"*, not as a list of
words to sprinkle into existing copy.

**The `<meta name="keywords">` tag does nothing.** Google has ignored it since
2009. It is currently populated in `src/i18n/messages/*.json` under
`metadata.keywords`. It is harmless, but it is not doing any work — do not
mistake editing it for SEO.

---

## What is realistically winnable

A site with 8 pages, no backlinks and no publishing history will not rank for
broad terms. Sort targets by whether they can actually be won.

### Tier 1 — Brand terms (winnable now, close to free)

Near-zero competition. If these are not already ranking first, it is only
because the site is new and under-crawled.

| Query | Target page |
|---|---|
| `AYA Informatica RW` | `/` |
| `AYA Informatica Rwanda` | `/` |
| `RAY Markets` | `/products` |
| `RAY Markets app Rwanda` | `/products` |
| `Humura app` | `/products` |
| `Humura mental wellness` | `/products` |

**Action:** these need no new pages. They need the site crawled and, ideally,
a Google Business Profile plus a few directory listings so the brand resolves.

### Who you are actually competing with

Checked against live search results in August 2026, not estimated. Worth
knowing before setting expectations, because both markets are already occupied.

**RAY Markets is entering a crowded field.** The first page for
"online marketplace Rwanda / buy and sell classifieds Kigali" is already held
by: [Jumia Deals](https://deals.jumia.rw/kigali),
[Catchyz Rwanda](https://rw.catchyz.com/en/),
[Kwetumarket](https://kwetumarket.com/),
[Kigali Online](https://kigalionline.com/),
[Murukali](https://murukali.com/),
[KigaliLife](https://kigalilife.co.rw/), [lulu.rw](https://lulu.rw/),
[IMALI.biz](https://imali.biz/) and [RwandaMart](https://rwandamart.rw/).

Jumia is a continental brand with years of domain authority. **Do not target
"marketplace Rwanda" head-on** — it is not winnable in the next year and effort
spent there produces nothing. Tier 3 below is where RAY can actually win.

**AYA's market is less crowded but has an establishe­d leader.**
[Awesomity](https://awesomity.rw/) is the name that comes up first, alongside
[Kigali Web Developers](https://www.kigalidev.com/),
[Enoveta](https://enoveta.com/), [Sokrab](https://sokrab.com/),
[RUNI Rw](https://runirw.com/) and [ITS Ltd](https://itsltd.online/).

**The most useful finding: directories outrank the companies themselves.** The
top two results for "web development companies Kigali" are
[TechBehemoths](https://techbehemoths.com/companies/web-development/kigali)
listing pages, not any agency's own site. Ranking above a directory is far
harder than being listed *in* it — and a listing puts you in front of the same
searcher on day one. Getting onto TechBehemoths, Clutch and GoodFirms is
higher-leverage than any on-page work in this document, and it is free.

**Neither brand currently appears in search at all.** Expected for sites this
new, and the reason Tier 1 matters first. (Caveat: the search tooling used here
returns US-centric results, so a Rwandan SERP will differ in detail — the
competitor set and the directory pattern will not.)

### Tier 2 — Local service intent (winnable in months, highest commercial value)

This is how a Rwandan business actually looks for a development partner. Real
purchase intent, moderate and *local* competition — see the competitor list
above for who currently holds these.

| Query | Target page |
|---|---|
| `software development company Kigali` | `/services` |
| `app development company Rwanda` | `/services` |
| `mobile app developers Kigali` | new: `/services/mobile-apps` |
| `custom software development Rwanda` | new: `/services/custom-software` |
| `web development company Rwanda` | new: `/services/web-development` |

**Action:** `/services` currently covers three pillars on one page, so it
competes with itself. One page per service, each targeting one query, is the
single highest-value structural change on this list.

### Tier 3 — RAY Markets' actual market (long-tail, low competition, high intent)

These are the people RAY Markets exists for, at the moment they want it.

| Query | Target page |
|---|---|
| `sell phone online Rwanda` | new: guide or landing page |
| `buy used iPhone Kigali` | new |
| `where to sell electronics Kigali` | new |
| `online marketplace Rwanda` | `/products` |
| `buy and sell phones Rwanda` | new |

**Action:** each needs a page that genuinely answers the question. A guide
titled "How to sell your phone safely in Kigali" that happens to end with RAY Markets
will outrank a product page for all of these.

### Tier 4 — Kinyarwanda (the most under-exploited advantage here)

Almost nobody optimises for Kinyarwanda-language search. The `/rw` locale
already exists, is prerendered, and now has correct hreflang — the hard part is
done. Competition is close to zero.

| Query | Notes |
|---|---|
| `kugurisha telefoni ku murongo` | selling phones online |
| `kugura telefoni Kigali` | buying phones in Kigali |
| `ubuzima bwo mu mutwe` | mental health — Humura's market |
| `isoko rya interineti mu Rwanda` | online marketplace in Rwanda |
| `gukora porogaramu mu Rwanda` | software development in Rwanda |

**Caveat:** the current Kinyarwanda copy is machine-translated. Ranking for
these while reading awkwardly to native speakers would damage the brand more
than the traffic is worth. Get the translation reviewed before pursuing this.

### Tier 5 — Head terms (do not chase yet)

`Rwanda technology`, `Africa tech`, `digital platforms`, `African digital
infrastructure`.

These are currently in `metadata.keywords`. They are broad, dominated by
established publishers and institutions, and carry almost no purchase intent —
someone searching "Africa tech" is reading, not hiring. They will follow from
authority built elsewhere; they are not a starting point.

---

## One page, one query

Each page should have a single primary target. The site currently has eight
pages, so it can meaningfully compete for roughly eight clusters until more are
added.

| Page | Primary target | Status |
|---|---|---|
| `/` | AYA Informatica RW (brand) | fine |
| `/about` | AYA Informatica RW team / Kigali | fine |
| `/products` | RAY Markets (brand) | fine |
| `/services` | software development company Kigali | **competes with itself** — three pillars, one page |
| `/blog` | — | **no articles**; ranks for nothing |
| `/contact` | — | not a ranking page, and that is correct |
| `/privacy`, `/terms` | — | not ranking pages |

---

## What to do, in order

1. **Confirm indexing in Google Search Console.** Nothing below matters if the
   pages are not in the index. See "Checking indexing" in `SEO-UPGRADES.md`.
2. **Split `/services` into one page per pillar.** Highest commercial value,
   and purely structural — the copy already exists.
3. **Publish the three planned blog posts.** The blog currently ranks for
   nothing because it contains nothing. Three real articles targeting Tier 3
   queries would be the first genuine organic traffic.
4. **Get the Kinyarwanda copy reviewed**, then treat `/rw` as a real channel
   rather than a checkbox.
5. **Build the first ten links** — Rwandan startup directories, Crunchbase,
   local tech press, ProductHunt when RAY Markets launches. Slowest lever, so start it
   early and in parallel.

---

## What will not work

- Adding more terms to `metadata.keywords`. Google ignores it.
- Repeating target phrases in existing copy. There is no page-count problem to
  solve by rewording; there is a page-count problem to solve by writing pages.
- Chasing Tier 5 terms before Tiers 1–3 are won.
- Expecting movement in weeks. A new domain with no link history typically takes
  three to six months to rank for anything competitive, and that assumes
  content is shipping.
