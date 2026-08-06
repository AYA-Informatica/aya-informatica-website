/**
 * Captures each page section in both colour schemes, for visual review.
 *
 * Usage:
 *   npm run build && npm start     # in one terminal
 *   npm run screenshot             # in another
 *
 * Output goes to .screenshots/ (gitignored).
 *
 * Sections are captured individually rather than as full pages. Playwright's
 * `fullPage` leaves most of a tall page blank — content below the fold is not
 * painted before the capture — and enlarging the viewport instead stretches the
 * hero, which is sized in `vh`. Scrolling each section into view at a normal
 * viewport avoids both, and the output is more readable for review.
 */
import { chromium } from "playwright"
import { mkdirSync } from "node:fs"

const OUT = process.env.SCREENSHOT_DIR || ".screenshots"
const BASE = process.env.SCREENSHOT_BASE || "http://localhost:3000"

const ROUTES = [
  ["home", "/"],
  ["products", "/products"],
  ["contact", "/contact"],
  ["blog", "/blog"],
  ["about", "/about"],
]

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch()

for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    // No stored preference is set, so the theme script falls through to the
    // system setting — which is what this emulates.
    colorScheme: scheme,
    // Sections reveal from opacity:0 on scroll; the motion components fall back
    // to plain divs under this, so nothing is caught mid-transition.
    reducedMotion: "reduce",
  })
  const page = await ctx.newPage()

  for (const [name, path] of ROUTES) {
    await page.goto(BASE + path, { waitUntil: "networkidle" })
    await page.waitForTimeout(400)

    // Chrome: the navbar sitting over the hero.
    await page.screenshot({ path: `${OUT}/${name}-${scheme}-00-top.png` })

    const sections = page.locator("main section")
    const count = await sections.count()
    for (let i = 0; i < count; i++) {
      const s = sections.nth(i)
      await s.scrollIntoViewIfNeeded()
      await page.waitForTimeout(250)
      await s.screenshot({
        path: `${OUT}/${name}-${scheme}-${String(i + 1).padStart(2, "0")}.png`,
      })
    }
    console.log(`  ${name}-${scheme}: ${count + 1} images`)
  }
  await ctx.close()
}

await browser.close()
console.log(`\nWrote to ${OUT}/`)
