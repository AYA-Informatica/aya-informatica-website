# AYA Informatica RW — Keyword Strategy

Last updated: August 2025

---

## Read this first

**Keywords are not currently the bottleneck.** The site is technically in good
shape — every route is prerendered, canonical, indexable, and now carries
correct `hreflang`. What it does not have is content or links, and those are what
actually decide rankings.

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

### Tier 2 — Local service intent (winnable in months, highest commercial value)

This is how a Rwandan business actually looks for a development partner. Real
purchase intent, moderate and *local* competition.

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
