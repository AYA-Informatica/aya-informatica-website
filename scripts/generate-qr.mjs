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
// src/components/sections/download-app-menu.tsx — see that file for why
// this points at Expo's build artifact rather than a self-hosted file.
const DOWNLOAD_URL = "https://expo.dev/artifacts/eas/hPR8HQH-jzxrO6OYsKu3lCCajwsstvXt13jnQBO3znE.apk"
const OUT = "public/ray-download-qr.svg"

const svg = await QRCode.toString(DOWNLOAD_URL, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 1,
  color: { dark: "#0B1220", light: "#00000000" },
})

writeFileSync(OUT, svg)
console.log(`QR code for ${DOWNLOAD_URL} written to ${OUT}`)
