import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const warn = vi.fn()
vi.mock("./logger", () => ({
  logger: { warn, error: vi.fn(), info: vi.fn() },
}))

/**
 * turnstile.ts reads TURNSTILE_SECRET_KEY at module scope, so each test sets
 * the environment and then imports a fresh copy of the module.
 */
async function loadVerify() {
  const mod = await import("./turnstile")
  return mod.verifyTurnstile
}

function jsonResponse(body: unknown, ok = true) {
  return {
    ok,
    status: ok ? 200 : 500,
    json: async () => body,
  } as unknown as Response
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  vi.stubGlobal("fetch", vi.fn())
  process.env.TURNSTILE_SECRET_KEY = "test-secret"
})

afterEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY
  vi.unstubAllGlobals()
})

describe("verifyTurnstile — configuration", () => {
  it("short-circuits to true when no secret is configured", async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("any-token")).resolves.toBe(true)
    expect(fetch).not.toHaveBeenCalled()
  })

  it("posts the secret and token to Cloudflare", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ success: true }))
    const verifyTurnstile = await loadVerify()

    await verifyTurnstile("the-token")

    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify")
    const body = (init?.body as URLSearchParams).toString()
    expect(body).toContain("secret=test-secret")
    expect(body).toContain("response=the-token")
  })
})

describe("verifyTurnstile — verdicts", () => {
  it("returns true for a token Cloudflare accepts", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ success: true }))
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("good")).resolves.toBe(true)
  })

  it("returns false for a token Cloudflare rejects", async () => {
    vi.mocked(fetch).mockResolvedValue(
      jsonResponse({ success: false, "error-codes": ["invalid-input-response"] })
    )
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("bad")).resolves.toBe(false)
  })
})

describe("verifyTurnstile — resilience", () => {
  // A Cloudflare outage must not take the contact form down. The honeypot and
  // the IP rate limiter remain in force, so failing open degrades spam
  // protection rather than blocking every genuine submission.

  it("applies a timeout signal to the request", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ success: true }))
    const verifyTurnstile = await loadVerify()

    await verifyTurnstile("token")

    const init = vi.mocked(fetch).mock.calls[0][1]
    expect(init?.signal).toBeInstanceOf(AbortSignal)
  })

  it("fails open when the request times out", async () => {
    const abortError = new Error("The operation was aborted")
    abortError.name = "TimeoutError"
    vi.mocked(fetch).mockRejectedValue(abortError)
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("token")).resolves.toBe(true)
    expect(warn).toHaveBeenCalled()
  })

  it("fails open on a network error", async () => {
    vi.mocked(fetch).mockRejectedValue(new TypeError("fetch failed"))
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("token")).resolves.toBe(true)
    expect(warn).toHaveBeenCalled()
  })

  it("fails open when the response is not valid JSON", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => {
        throw new SyntaxError("Unexpected token < in JSON")
      },
    } as unknown as Response)
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("token")).resolves.toBe(true)
    expect(warn).toHaveBeenCalled()
  })

  it("fails open on a non-OK HTTP status", async () => {
    vi.mocked(fetch).mockResolvedValue(jsonResponse({}, false))
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("token")).resolves.toBe(true)
    expect(warn).toHaveBeenCalled()
  })

  it("does not fail open when Cloudflare gives a definite rejection", async () => {
    // A clear "success: false" is an answer, not an outage — it must be honoured.
    vi.mocked(fetch).mockResolvedValue(jsonResponse({ success: false }))
    const verifyTurnstile = await loadVerify()

    await expect(verifyTurnstile("token")).resolves.toBe(false)
    expect(warn).not.toHaveBeenCalled()
  })
})
