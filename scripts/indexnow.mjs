/**
 * Submits every sitemap URL to the IndexNow API.
 *
 *   npm run indexnow
 *
 * Why this exists: the site is indexed by Google and invisible everywhere else.
 * A DuckDuckGo `site:` query returned nothing, and DuckDuckGo's results come
 * from Bing's index, so Bing has never crawled this domain. Search Console
 * tells Google about the site; it tells nobody else. Bing, Yandex, Seznam,
 * Naver and Yep run separate crawlers with separate submission systems, and a
 * new domain with almost no inbound links can wait months for them to find it
 * on their own, or never.
 *
 * IndexNow is the one mechanism that pushes rather than waits. Submitting to
 * any participating engine notifies all of them.
 *
 * Not covered by this: Google ignores IndexNow, and Brave Search runs an
 * independent index with no submission endpoint — Brave has to find the site
 * by crawling a link to it from somewhere it already trusts.
 *
 * Safe to re-run. Engines treat repeat submissions of unchanged URLs as
 * no-ops, though there is no reason to run it more than once per deploy.
 */
import { readFileSync, readdirSync } from "node:fs"

const HOST = "www.ayainformatica.tech"
const ENDPOINT = "https://api.indexnow.org/indexnow"

/**
 * The key is proved by hosting `<key>.txt` at the site root, containing the
 * key and nothing else. Read from public/ rather than hard-coded, so the file
 * and the payload cannot disagree — a mismatch is rejected with 403 and the
 * reason is not obvious from the response.
 */
function findKey() {
  const candidates = readdirSync("public").filter((f) => /^[0-9a-f]{16,128}\.txt$/.test(f))
  if (candidates.length !== 1) {
    throw new Error(
      `expected exactly one IndexNow key file in public/, found ${candidates.length}` +
        (candidates.length ? `: ${candidates.join(", ")}` : "")
    )
  }
  const file = candidates[0]
  const key = readFileSync(`public/${file}`, "utf8").trim()
  if (`${key}.txt` !== file) {
    throw new Error(`key file ${file} does not contain its own name — IndexNow will reject it`)
  }
  return key
}

/** Pulls the live sitemap rather than rebuilding the URL list here. */
async function sitemapUrls() {
  const res = await fetch(`https://${HOST}/sitemap.xml`)
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`)
  const xml = await res.text()
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
}

const key = findKey()
const urlList = await sitemapUrls()

if (!urlList.length) throw new Error("sitemap contained no URLs")
console.log(`Submitting ${urlList.length} URLs for ${HOST} …`)

const res = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `https://${HOST}/${key}.txt`, urlList }),
})

// 200 accepted, 202 accepted but the key is still being verified. Both fine.
if (res.status === 200 || res.status === 202) {
  console.log(`  ${res.status} — accepted. Bing, Yandex, Seznam, Naver and Yep now have the list.`)
} else {
  const body = await res.text().catch(() => "")
  console.error(`  ${res.status} — rejected. ${body}`)
  // 403 almost always means the key file is not reachable at keyLocation yet,
  // which happens when this runs before the deploy carrying it has finished.
  if (res.status === 403) {
    console.error(`  Check https://${HOST}/${key}.txt returns the key as plain text.`)
  }
  process.exitCode = 1
}
