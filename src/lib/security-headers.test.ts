import { afterEach, describe, expect, it, vi } from "vitest"

/**
 * security-headers.js reads NODE_ENV at module scope, so each case stubs the
 * environment and then imports a fresh copy. `vi.stubEnv` is used rather than
 * assigning to process.env directly, since NODE_ENV is typed read-only.
 */
async function loadFor(
  env: string,
  { turnstileSiteKey = "" }: { turnstileSiteKey?: string } = {}
) {
  vi.resetModules()
  vi.stubEnv("NODE_ENV", env)
  // An empty string is falsy, so this switches Turnstile off by default.
  vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", turnstileSiteKey)

  return (await import("./security-headers")) as unknown as {
    CONTENT_SECURITY_POLICY: string
    SECURITY_HEADERS: Record<string, string>
    SECURITY_HEADERS_LIST: Array<{ key: string; value: string }>
    isDev: boolean
  }
}

/** Pull a single directive out of the policy string. */
function directive(policy: string, name: string) {
  return policy.split("; ").find((d) => d.startsWith(`${name} `)) ?? ""
}

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

describe("Content-Security-Policy — production", () => {
  // React needs eval() only in development. Letting 'unsafe-eval' reach
  // production would remove a meaningful part of what the CSP buys.
  it("never allows unsafe-eval", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("production")
    expect(CONTENT_SECURITY_POLICY).not.toContain("unsafe-eval")
  })

  it("never allows plaintext websocket schemes", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("production")
    expect(directive(CONTENT_SECURITY_POLICY, "connect-src")).not.toMatch(/\bws:/)
  })

  it("keeps the framing and base-uri lockdown", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("production")
    expect(CONTENT_SECURITY_POLICY).toContain("default-src 'self'")
    expect(CONTENT_SECURITY_POLICY).toContain("frame-ancestors 'none'")
    expect(CONTENT_SECURITY_POLICY).toContain("base-uri 'self'")
    expect(CONTENT_SECURITY_POLICY).toContain("form-action 'self'")
  })

  it("does not allow the Turnstile origin when no site key is configured", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("production")
    expect(CONTENT_SECURITY_POLICY).not.toContain("challenges.cloudflare.com")
  })

  it("allows the Turnstile origin in script-src, connect-src and frame-src when configured", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("production", {
      turnstileSiteKey: "test-site-key",
    })

    for (const name of ["script-src", "connect-src", "frame-src"]) {
      expect(
        directive(CONTENT_SECURITY_POLICY, name),
        `${name} should allow Turnstile`
      ).toContain("https://challenges.cloudflare.com")
    }
  })
})

describe("Content-Security-Policy — development", () => {
  it("allows unsafe-eval so React's dev build can run", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("development")
    expect(directive(CONTENT_SECURITY_POLICY, "script-src")).toContain("'unsafe-eval'")
  })

  it("allows the websocket schemes Turbopack hot reload needs", async () => {
    const { CONTENT_SECURITY_POLICY } = await loadFor("development")
    const connect = directive(CONTENT_SECURITY_POLICY, "connect-src")
    expect(connect).toContain("ws:")
    expect(connect).toContain("wss:")
  })
})

describe("security headers", () => {
  it("exposes the same headers as an object and as a list", async () => {
    const { SECURITY_HEADERS, SECURITY_HEADERS_LIST } = await loadFor("production")
    const fromList = Object.fromEntries(
      SECURITY_HEADERS_LIST.map(({ key, value }) => [key, value])
    )
    expect(fromList).toEqual(SECURITY_HEADERS)
  })

  it("includes the expected header set", async () => {
    const { SECURITY_HEADERS } = await loadFor("production")
    expect(Object.keys(SECURITY_HEADERS).sort()).toEqual([
      "Content-Security-Policy",
      "Permissions-Policy",
      "Referrer-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "X-Frame-Options",
    ])
  })
})
