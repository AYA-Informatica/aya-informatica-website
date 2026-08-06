import { describe, expect, it } from "vitest"
import {
  MAX_BODY_BYTES,
  RATE_TIERS,
  exceedsBodyLimit,
  isAllowedMethod,
  isProbePath,
  resolveClientIp,
  tierFor,
  viaCloudflare,
} from "./traffic-guard"

const headers = (init: Record<string, string>) => new Headers(init)

describe("resolveClientIp", () => {
  it("prefers Cloudflare's header, which the caller cannot forge", () => {
    const h = headers({
      "cf-connecting-ip": "203.0.113.7",
      "x-forwarded-for": "1.2.3.4",
      "x-real-ip": "5.6.7.8",
    })
    expect(resolveClientIp(h)).toBe("203.0.113.7")
  })

  it("falls back to Vercel's header when Cloudflare is not in front", () => {
    const h = headers({ "x-vercel-forwarded-for": "203.0.113.9", "x-forwarded-for": "1.2.3.4" })
    expect(resolveClientIp(h)).toBe("203.0.113.9")
  })

  it("prefers x-real-ip over x-forwarded-for", () => {
    expect(resolveClientIp(headers({ "x-real-ip": "9.9.9.9", "x-forwarded-for": "1.2.3.4" })))
      .toBe("9.9.9.9")
  })

  it("does NOT let a spoofed x-forwarded-for override a trusted header", () => {
    // The attack this ordering exists to stop: rotate x-forwarded-for and get a
    // fresh rate-limit budget on every request.
    const attempts = ["1.1.1.1", "2.2.2.2", "3.3.3.3"].map((spoofed) =>
      resolveClientIp(headers({ "cf-connecting-ip": "198.51.100.5", "x-forwarded-for": spoofed })),
    )
    expect(new Set(attempts).size).toBe(1)
    expect(attempts[0]).toBe("198.51.100.5")
  })

  it("uses only the first hop of a forwarded chain", () => {
    expect(resolveClientIp(headers({ "x-forwarded-for": "203.0.113.1, 70.41.3.18, 150.172.238.178" })))
      .toBe("203.0.113.1")
  })

  it("ignores an empty header rather than returning a blank key", () => {
    expect(resolveClientIp(headers({ "cf-connecting-ip": "  ", "x-real-ip": "8.8.8.8" })))
      .toBe("8.8.8.8")
  })

  it("returns a stable placeholder when nothing identifies the caller", () => {
    expect(resolveClientIp(headers({}))).toBe("unknown")
  })
})

describe("viaCloudflare", () => {
  it("needs both markers, so one copied header does not fake it", () => {
    expect(viaCloudflare(headers({ "cf-connecting-ip": "1.1.1.1", "cf-ray": "abc-LHR" }))).toBe(true)
    expect(viaCloudflare(headers({ "cf-connecting-ip": "1.1.1.1" }))).toBe(false)
    expect(viaCloudflare(headers({}))).toBe(false)
  })
})

describe("isProbePath", () => {
  it.each([
    "/wp-login.php",
    "/wp-admin/setup-config.php",
    "/.env",
    "/.env.local",
    "/.git/config",
    "/phpmyadmin/index.php",
    "/vendor/phpunit/phpunit/phpunit.xml",
    "/cgi-bin/test.cgi",
    "/actuator/health",
    "/.ssh/id_rsa",
  ])("blocks %s", (path) => {
    expect(isProbePath(path)).toBe(true)
  })

  it("is case-insensitive, so /WP-Admin does not slip through", () => {
    expect(isProbePath("/WP-ADMIN/")).toBe(true)
    expect(isProbePath("/.Git/config")).toBe(true)
  })

  it.each([
    "/",
    "/about",
    "/products",
    "/services",
    "/blog",
    "/contact",
    "/privacy",
    "/terms",
    "/fr/about",
    "/rw/contact",
    "/api/contact",
  ])("allows the real route %s", (path) => {
    expect(isProbePath(path)).toBe(false)
  })

  it.each(["/robots.txt", "/sitemap.xml", "/manifest.json", "/favicon.ico", "/sw.js"])(
    "allows the well-known file %s",
    (path) => {
      expect(isProbePath(path)).toBe(false)
    },
  )

  it("allows /.well-known, which ACME and Apple use", () => {
    expect(isProbePath("/.well-known/acme-challenge/xyz")).toBe(false)
    expect(isProbePath("/.well-known/apple-app-site-association")).toBe(false)
  })
})

describe("isAllowedMethod", () => {
  it.each(["GET", "HEAD", "POST", "OPTIONS", "get", "post"])("allows %s", (m) => {
    expect(isAllowedMethod(m)).toBe(true)
  })

  it.each(["TRACE", "TRACK", "CONNECT", "PUT", "PATCH", "DELETE"])("refuses %s", (m) => {
    expect(isAllowedMethod(m)).toBe(false)
  })
})

describe("exceedsBodyLimit", () => {
  it("accepts a body within the cap", () => {
    expect(exceedsBodyLimit(headers({ "content-length": String(MAX_BODY_BYTES - 1) }))).toBe(false)
  })

  it("accepts a body exactly at the cap", () => {
    expect(exceedsBodyLimit(headers({ "content-length": String(MAX_BODY_BYTES) }))).toBe(false)
  })

  it("refuses a body over the cap", () => {
    expect(exceedsBodyLimit(headers({ "content-length": String(MAX_BODY_BYTES + 1) }))).toBe(true)
  })

  it("does not refuse when the length is absent or unparseable", () => {
    // An absent length is normal for a chunked request; refusing on a value we
    // cannot read would reject legitimate traffic on a guess.
    expect(exceedsBodyLimit(headers({}))).toBe(false)
    expect(exceedsBodyLimit(headers({ "content-length": "not-a-number" }))).toBe(false)
  })

  it("leaves room for a real submission", () => {
    // 2000-character message plus the other fields, worst case in UTF-8.
    expect(MAX_BODY_BYTES).toBeGreaterThan(2000 * 4)
  })
})

describe("tierFor", () => {
  it("puts the contact endpoint in the strictest tier", () => {
    expect(tierFor("/api/contact")).toBe(RATE_TIERS.contact)
  })

  it("puts other API routes in the api tier", () => {
    expect(tierFor("/api/anything")).toBe(RATE_TIERS.api)
  })

  it.each(["/", "/about", "/fr/products", "/rw/contact"])("puts %s in the page tier", (p) => {
    expect(tierFor(p)).toBe(RATE_TIERS.page)
  })

  it("keeps the tiers ordered from strictest to most generous", () => {
    expect(RATE_TIERS.contact.max).toBeLessThan(RATE_TIERS.api.max)
    expect(RATE_TIERS.api.max).toBeLessThan(RATE_TIERS.page.max)
  })

  it("leaves the page tier generous enough for shared addresses", () => {
    // Carrier-grade NAT is common across East Africa, so many genuine visitors
    // can share one address. A tight page limit would lock them out together.
    expect(RATE_TIERS.page.max).toBeGreaterThanOrEqual(120)
  })
})
