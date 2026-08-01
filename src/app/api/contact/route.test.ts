import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"

const sendContactEmail = vi.fn()
const verifyTurnstile = vi.fn()

vi.mock("@/lib/mailer", () => ({
  sendContactEmail: (...args: unknown[]) => sendContactEmail(...args),
}))
vi.mock("@/lib/turnstile", () => ({
  verifyTurnstile: (...args: unknown[]) => verifyTurnstile(...args),
}))
vi.mock("@/lib/logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

const validBody = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+250 787 891 746",
  subject: "partnership",
  message: "I would like to discuss a partnership opportunity with your team.",
}

function request(body: unknown, headers: Record<string, string> = {}) {
  const payload = typeof body === "string" ? body : JSON.stringify(body)
  return new NextRequest("https://ayainformatica.tech/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: payload,
  })
}

async function post(req: NextRequest) {
  const { POST } = await import("./route")
  return POST(req)
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  sendContactEmail.mockResolvedValue({ success: true, messageId: "msg-1" })
  verifyTurnstile.mockResolvedValue(true)
  delete process.env.TURNSTILE_SECRET_KEY
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
})

afterEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY
  delete process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
})

describe("POST /api/contact — happy path", () => {
  it("accepts a valid submission and sends the email", async () => {
    const res = await post(request(validBody))

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })

  it("passes sanitized data to the mailer", async () => {
    await post(request({ ...validBody, name: "Jane <b>Doe</b>" }))

    expect(sendContactEmail).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Jane Doe" })
    )
  })
})

describe("POST /api/contact — request guards", () => {
  it("rejects an oversized payload with 413", async () => {
    const res = await post(request(validBody, { "content-length": "20000" }))

    expect(res.status).toBe(413)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("rejects malformed JSON with 400", async () => {
    const res = await post(request("{ not json"))

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ error: "Invalid JSON body" })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("rejects an invalid payload with 400 and field errors", async () => {
    const res = await post(request({ ...validBody, email: "nope" }))

    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBe("Validation failed")
    expect(body.fields).toHaveProperty("email")
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("rejects a message that is only markup", async () => {
    // Guards the sanitize-before-validate ordering at the route boundary.
    const res = await post(request({ ...validBody, message: "<b></b><i></i><u></u><s></s>" }))

    expect(res.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })
})

describe("POST /api/contact — honeypot", () => {
  it("silently accepts a honeypot hit without sending mail", async () => {
    const res = await post(request({ ...validBody, _honey: "i-am-a-bot" }))

    // Returns success so the bot cannot tell it was detected.
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ success: true })
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("ignores an empty honeypot field", async () => {
    const res = await post(request({ ...validBody, _honey: "" }))

    expect(res.status).toBe(200)
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })
})

describe("POST /api/contact — Turnstile enforcement", () => {
  it("does not require a token when neither key is configured", async () => {
    const res = await post(request(validBody))

    expect(res.status).toBe(200)
    expect(verifyTurnstile).not.toHaveBeenCalled()
  })

  it("does not enforce when only the server secret is configured", async () => {
    // The regression this guards: with only the secret set, the client has no
    // widget to produce a token, so enforcing would reject every genuine
    // submission.
    process.env.TURNSTILE_SECRET_KEY = "secret-only"

    const res = await post(request(validBody))

    expect(res.status).toBe(200)
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })

  it("does not enforce when only the public site key is configured", async () => {
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site-only"

    const res = await post(request(validBody))

    expect(res.status).toBe(200)
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })

  it("requires a token when both keys are configured", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret"
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site"

    const res = await post(request(validBody))

    expect(res.status).toBe(400)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("rejects a token Cloudflare refuses with 403", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret"
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site"
    verifyTurnstile.mockResolvedValue(false)

    const res = await post(
      request({ ...validBody, "cf-turnstile-response": "bad-token" })
    )

    expect(res.status).toBe(403)
    expect(sendContactEmail).not.toHaveBeenCalled()
  })

  it("proceeds when the token verifies", async () => {
    process.env.TURNSTILE_SECRET_KEY = "secret"
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "site"

    const res = await post(
      request({ ...validBody, "cf-turnstile-response": "good-token" })
    )

    expect(res.status).toBe(200)
    expect(verifyTurnstile).toHaveBeenCalledWith("good-token")
    expect(sendContactEmail).toHaveBeenCalledTimes(1)
  })
})

describe("POST /api/contact — failure handling", () => {
  it("returns 500 without leaking internal detail when the mailer throws", async () => {
    sendContactEmail.mockRejectedValue(
      new Error("SMTP auth failed for user secret@example.com")
    )

    const res = await post(request(validBody))
    const body = await res.json()

    expect(res.status).toBe(500)
    expect(JSON.stringify(body)).not.toContain("SMTP")
    expect(JSON.stringify(body)).not.toContain("secret@example.com")
  })
})
