/**
 * Regenerates every small favicon from the one source of truth.
 *
 * Run after replacing public/apple-touch-icon.png:
 *
 *   npm run generate-icons
 *
 * Why this exists: the raster favicons and the app icon were exported
 * separately and drifted into two different marks — a circular badge in the
 * app icon, a navy square in favicon.svg — so a browser tab and a bookmark
 * showed different logos. Deriving the small sizes from the large one makes
 * that impossible.
 *
 * ── Same brand, different job ──────────────────────────────────────────
 *
 * The app icon is a full lockup: disc, "AYA", "Informatica" underneath, and an
 * RW roundel. At 180px on a home screen every part of that reads. At 32px in a
 * browser tab it does not — "Informatica" collapses into a grey smear under
 * the wordmark and the roundel becomes a blob, and no resampling quality
 * setting rescues either.
 *
 * So the small sizes use a simplified cut of the *same* artwork: the same
 * disc, the same letterforms, "AYA" alone, scaled to fill the badge. Nothing
 * is redrawn — the wordmark is extracted from the source at full resolution,
 * so it stays the real logo rather than an approximation of it.
 *
 * That split is deliberate and normal: 180px and above gets the lockup,
 * 48px and below gets the mark.
 */
import sharp from "sharp"
import { writeFileSync, statSync } from "node:fs"

const SOURCE = "public/apple-touch-icon.png"
const SIZES = [16, 32, 48]

/**
 * Where "AYA" sits inside the 180x180 source, found by scanning for bands of
 * ink rather than guessed: rows 56-102 hold the wordmark, rows 108-125 hold
 * "Informatica". The box below is that band with a little air, stopping short
 * of the roundel on the right.
 *
 * If the source artwork is ever re-exported with different proportions, these
 * numbers must be re-measured — a wrong crop here silently ships a clipped logo.
 */
const WORDMARK = { left: 25, top: 50, width: 124, height: 58 }

/** Disc colour sampled from the source, and how much of the badge "AYA" fills. */
const DISC = "#F8F8F8"
const CANVAS = 180
const FILL = 0.7

/**
 * Writes an ICO container around already-encoded PNGs.
 *
 * PNG-in-ICO rather than the older BMP form: it is understood by every browser
 * and by Windows Vista onwards, and it keeps the alpha channel without the
 * separate AND mask the BMP variant needs.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // 1 = icon
  header.writeUInt16LE(entries.length, 4)

  const directory = Buffer.alloc(16 * entries.length)
  let offset = header.length + directory.length

  entries.forEach(({ size, buf }, i) => {
    const at = i * 16
    // 0 encodes 256 — the field is a single byte.
    directory.writeUInt8(size >= 256 ? 0 : size, at)
    directory.writeUInt8(size >= 256 ? 0 : size, at + 1)
    directory.writeUInt8(0, at + 2) // palette size, 0 for truecolour
    directory.writeUInt8(0, at + 3) // reserved
    directory.writeUInt16LE(1, at + 4) // colour planes
    directory.writeUInt16LE(32, at + 6) // bits per pixel
    directory.writeUInt32LE(buf.length, at + 8)
    directory.writeUInt32LE(offset, at + 12)
    offset += buf.length
  })

  return Buffer.concat([header, directory, ...entries.map((e) => e.buf)])
}

/** Rebuilds the badge with "AYA" alone, at full source resolution. */
async function buildSimplifiedBadge() {
  const disc = Buffer.from(
    `<svg width="${CANVAS}" height="${CANVAS}">` +
      `<circle cx="${CANVAS / 2}" cy="${CANVAS / 2}" r="${CANVAS / 2}" fill="${DISC}"/></svg>`
  )

  const wordmark = await sharp(SOURCE).extract(WORDMARK).toBuffer()
  const width = Math.round(CANVAS * FILL)
  const scaled = await sharp(wordmark).resize({ width }).toBuffer()
  const { height } = await sharp(scaled).metadata()

  return sharp(disc)
    .composite([
      {
        input: scaled,
        left: Math.round((CANVAS - width) / 2),
        top: Math.round((CANVAS - height) / 2),
      },
    ])
    .png()
    .toBuffer()
}

const badge = await buildSimplifiedBadge()

const render = (size) =>
  sharp(badge)
    .resize(size, size, { kernel: "lanczos3" })
    // Downscaling this far softens the stems past reading; a light unsharp
    // pass brings them back without visible haloing at these sizes.
    .sharpen({ sigma: 0.5 })
    .png({ compressionLevel: 9 })
    .toBuffer()

const [png16, png32, png48] = await Promise.all(SIZES.map(render))

writeFileSync("public/favicon-16x16.png", png16)
writeFileSync("public/favicon-32x32.png", png32)
writeFileSync(
  "public/favicon.ico",
  buildIco([
    { size: 16, buf: png16 },
    { size: 32, buf: png32 },
    { size: 48, buf: png48 },
  ])
)

for (const f of ["favicon-16x16.png", "favicon-32x32.png", "favicon.ico"]) {
  console.log(`  public/${f.padEnd(20)} ${statSync(`public/${f}`).size} bytes`)
}
console.log(`\nGenerated from ${SOURCE}. Replace that file and re-run to update all three.`)
