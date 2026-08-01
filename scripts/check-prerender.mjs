/**
 * Fails the build if the localized routes stopped being prerendered.
 *
 * This exists because that regression is silent. `next build` prints
 * "Generating static pages (29/29)" whether or not the pages actually end up
 * in the prerender manifest, so static generation can be lost — every request
 * falling through to the server instead of the CDN — without any error, any
 * failing test, and no change to the build's exit code.
 *
 * It has happened once already: a `loading.tsx` converted from a Client to a
 * Server Component started resolving the locale from the request, which opted
 * all 24 localized routes out of static rendering. It went unnoticed for six
 * commits.
 */
import { readFileSync } from "node:fs"

const MANIFEST = ".next/prerender-manifest.json"
const LOCALES = ["en", "fr", "rw"]
const PATHS = ["", "/about", "/blog", "/contact", "/privacy", "/products", "/services", "/terms"]

let manifest
try {
  manifest = JSON.parse(readFileSync(MANIFEST, "utf8"))
} catch {
  console.error(`✗ prerender check: could not read ${MANIFEST}. Run \`next build\` first.`)
  process.exit(1)
}

const prerendered = new Set(Object.keys(manifest.routes ?? {}))
const expected = LOCALES.flatMap((l) => PATHS.map((p) => `/${l}${p}`))
const missing = expected.filter((route) => !prerendered.has(route))

if (missing.length > 0) {
  console.error(
    `\n✗ prerender check: ${missing.length} of ${expected.length} localized routes are NOT prerendered.\n`
  )
  console.error("  Missing:")
  for (const route of missing.slice(0, 10)) console.error(`    ${route}`)
  if (missing.length > 10) console.error(`    …and ${missing.length - 10} more`)
  console.error(
    "\n  These will be server-rendered on every request instead of served from the CDN.\n" +
      "  Usual cause: a Server Component reading request-scoped data — most often\n" +
      "  `useTranslations` in a file that cannot call `setRequestLocale` (it is not\n" +
      "  passed `params`), such as loading.tsx, error.tsx or not-found.tsx. Making\n" +
      "  that file a Client Component resolves it.\n"
  )
  process.exit(1)
}

console.log(`✓ prerender check: all ${expected.length} localized routes are prerendered`)
