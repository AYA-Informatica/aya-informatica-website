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
 * The 32px output is the one that matters. Most displays are high-DPI now, so
 * browsers ask for 32 rather than 16, and 16 survives only as a legacy
 * fallback where this artwork cannot be made legible at any quality setting.
 */
import sharp from "sharp"
import { writeFileSync, statSync } from "node:fs"

const SOURCE = "public/apple-touch-icon.png"
const SIZES = [16, 32, 48]

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

const trimmed = await sharp(SOURCE).trim({ threshold: 5 }).toBuffer()

const render = (size) =>
  sharp(trimmed)
    .resize(size, size, {
      kernel: "lanczos3",
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    // Downscaling this far softens the wordmark past reading; a light unsharp
    // pass brings the stems back without visible haloing at these sizes.
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
