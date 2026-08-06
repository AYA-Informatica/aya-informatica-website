/**
 * Generates the static QR code for the direct-APK-download link.
 *
 * Not run at build time — generated once and committed like any other
 * static asset. Re-run this whenever DOWNLOAD_URL in
 * src/components/sections/download-app-menu.tsx changes (keep the two in
 * sync manually; there's no build-time check that they match).
 *
 * Usage:
 *   node scripts/generate-qr.mjs
 */
import { writeFileSync } from "node:fs"
import QRCode from "qrcode"

// Keep in sync with DOWNLOAD_URL in
// src/components/sections/download-app-menu.tsx — see that file for the
// Vercel Blob upload command needed to publish a new build.
const DOWNLOAD_URL = "https://qqwe5gualahgrnd8.public.blob.vercel-storage.com/ray-markets-eIjygCxfvIpRfqRaVPQhY6kA7jWUuA.apk"
const OUT = "public/ray-download-qr.svg"

const svg = await QRCode.toString(DOWNLOAD_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: "#0B1220", light: "#00000000" },
})

writeFileSync(OUT, svg)
console.log(`QR code for ${DOWNLOAD_URL} written to ${OUT}`)
