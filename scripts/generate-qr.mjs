/**
 * Generates the static QR code for the direct-APK-download link.
 *
 * Not run at build time — the download URL is fixed (same domain, same
 * path, forever), so the SVG is generated once and committed like any other
 * static asset. Re-run this only if the download path or domain changes.
 *
 * Usage:
 *   node scripts/generate-qr.mjs
 */
import { writeFileSync } from "node:fs"
import QRCode from "qrcode"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://ayainformatica.tech"
const DOWNLOAD_URL = `${SITE_URL}/downloads/ray-markets.apk`
const OUT = "public/ray-download-qr.svg"

const svg = await QRCode.toString(DOWNLOAD_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: "#0B1220", light: "#00000000" },
})

writeFileSync(OUT, svg)
console.log(`QR code for ${DOWNLOAD_URL} written to ${OUT}`)
