import { describe, expect, it } from "vitest"
import { canonicalOrigin } from "./urls"

/**
 * Guards the host every ranking signal is built from.
 *
 * The failure this prevents: Vercel serves www and 308s the apex to it, while
 * NEXT_PUBLIC_SITE_URL — set in the Vercel dashboard, which overrides
 * vercel.json — names the apex. Every canonical, sitemap entry and hreflang
 * alternate then points at a URL that redirects, and the page Google lands on
 * canonicalises back to the one it just left.
 */
describe("canonicalOrigin", () => {
  it("rewrites the bare apex to the host that is actually served", () => {
    expect(canonicalOrigin("https://ayainformatica.tech")).toBe("https://www.ayainformatica.tech")
  })

  it("leaves an already-correct www origin alone", () => {
    expect(canonicalOrigin("https://www.ayainformatica.tech")).toBe(
      "https://www.ayainformatica.tech"
    )
  })

  it("is idempotent, so it cannot produce www.www", () => {
    const once = canonicalOrigin("https://ayainformatica.tech")
    expect(canonicalOrigin(once)).toBe(once)
  })

  it("drops any path, returning an origin", () => {
    expect(canonicalOrigin("https://ayainformatica.tech/products?x=1")).toBe(
      "https://www.ayainformatica.tech"
    )
  })

  it("leaves localhost alone — prefixing www there breaks local development", () => {
    expect(canonicalOrigin("http://localhost:3000")).toBe("http://localhost:3000")
  })

  it("leaves a Vercel preview host alone", () => {
    // Three labels, not a bare apex. www.<preview> does not resolve.
    expect(canonicalOrigin("https://aya-git-main.vercel.app")).toBe(
      "https://aya-git-main.vercel.app"
    )
  })

  it("preserves the scheme and a non-default port", () => {
    expect(canonicalOrigin("http://example.com:8080")).toBe("http://www.example.com:8080")
  })

  it("returns a malformed value unchanged rather than throwing the build", () => {
    expect(canonicalOrigin("not a url")).toBe("not a url")
  })
})
