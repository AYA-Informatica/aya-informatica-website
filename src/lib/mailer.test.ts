import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { ContactSchema } from "./validations"

// Captures every sendMail call so assertions can inspect the generated
// message bodies without touching a real SMTP server.
const sendMail = vi.fn()
const createTransport = vi.fn(() => ({ sendMail }))

vi.mock("nodemailer", () => ({
  default: {
    get createTransport() {
      return createTransport
    },
  },
}))

vi.mock("./logger", () => ({
  logger: { warn: vi.fn(), error: vi.fn(), info: vi.fn() },
}))

function contact(overrides: Partial<ContactSchema> = {}): ContactSchema {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    phone: "+250 787 891 746",
    subject: "partnership",
    message: "I would like to discuss a partnership opportunity.",
    ...overrides,
  } as ContactSchema
}

/** The HTML body of the first (notification) email. */
function notificationHtml(): string {
  return sendMail.mock.calls[0][0].html as string
}

/** The HTML body of the second (auto-reply) email. */
function autoReplyHtml(): string {
  return sendMail.mock.calls[1][0].html as string
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.resetModules()
  sendMail.mockResolvedValue({ messageId: "test-message-id" })
  process.env.SMTP_HOST = "smtp.example.com"
  process.env.SMTP_USER = "sender@example.com"
  process.env.SMTP_PASS = "app-password"
  process.env.CONTACT_TO = "inbox@example.com"
  delete process.env.SMTP_FALLBACK_HOST
})

afterEach(() => {
  delete process.env.SMTP_HOST
  delete process.env.SMTP_USER
  delete process.env.SMTP_PASS
  delete process.env.CONTACT_TO
})

async function send(data: ContactSchema) {
  const { sendContactEmail } = await import("./mailer")
  return sendContactEmail(data)
}

describe("sendContactEmail — HTML escaping", () => {
  // The mailer must not assume its input was sanitized upstream. These cases
  // pass raw markup directly, which is what a caller bypassing the Zod schema
  // (or a future refactor of it) would produce.

  it("escapes markup in the sender name", async () => {
    await send(contact({ name: "<img src=x onerror=alert(1)>" }))
    const html = notificationHtml()
    expect(html).not.toContain("<img src=x")
    expect(html).toContain("&lt;img src=x")
  })

  it("escapes markup in the name used by the reply button", async () => {
    // data.name.split(" ")[0] is interpolated separately from the full name.
    await send(contact({ name: "<script>alert(1)</script> Doe" }))
    expect(notificationHtml()).not.toContain("<script>")
  })

  it("escapes markup in the name echoed by the auto-reply", async () => {
    await send(contact({ name: "<script>alert(1)</script> Doe" }))
    expect(autoReplyHtml()).not.toContain("<script>")
  })

  it("escapes ampersands rather than emitting bare entities", async () => {
    await send(contact({ name: "Smith & Jones" }))
    const html = notificationHtml()
    expect(html).toContain("Smith &amp; Jones")
  })

  it("escapes double quotes so attribute values cannot be broken out of", async () => {
    await send(contact({ email: 'a"onmouseover="alert(1)@example.com' }))
    const html = notificationHtml()
    expect(html).not.toContain('"onmouseover="')
    expect(html).toContain("&quot;")
  })

  it("escapes single quotes", async () => {
    await send(contact({ name: "O'Brien" }))
    expect(notificationHtml()).toContain("&#39;")
  })

  it("escapes markup in the phone field", async () => {
    await send(contact({ phone: '"><script>alert(1)</script>' }))
    expect(notificationHtml()).not.toContain("<script>")
  })

  it("escapes the message body including ampersands", async () => {
    await send(contact({ message: "Tom & Jerry <b>bold</b> & more text here." }))
    const html = notificationHtml()
    expect(html).toContain("&amp;")
    expect(html).not.toContain("<b>bold</b>")
  })

  it("does not double-escape an ampersand", async () => {
    await send(contact({ name: "A & B" }))
    // "&" must become "&amp;", never "&amp;amp;"
    expect(notificationHtml()).not.toContain("&amp;amp;")
  })

  it("still renders the legitimate values", async () => {
    await send(contact({ name: "Jane Doe", email: "jane@example.com" }))
    const html = notificationHtml()
    expect(html).toContain("Jane Doe")
    expect(html).toContain("jane@example.com")
  })
})

describe("sendContactEmail — transport behaviour", () => {
  it("reuses one transporter for both the notification and the auto-reply", async () => {
    await send(contact())
    expect(sendMail).toHaveBeenCalledTimes(2)
    // Two emails, one connection — not one transporter per send.
    expect(createTransport).toHaveBeenCalledTimes(1)
  })

  it("returns the messageId of the notification email", async () => {
    const result = await send(contact())
    expect(result).toEqual({ success: true, messageId: "test-message-id" })
  })

  it("succeeds even when the auto-reply fails", async () => {
    sendMail
      .mockResolvedValueOnce({ messageId: "primary-id" })
      .mockRejectedValueOnce(new Error("recipient mailbox unavailable"))

    const result = await send(contact())
    expect(result.success).toBe(true)
    expect(result.messageId).toBe("primary-id")
  })

  it("propagates a failure of the notification email", async () => {
    sendMail.mockRejectedValue(new Error("smtp unreachable"))
    await expect(send(contact())).rejects.toThrow("smtp unreachable")
  })

  it("throws a configuration error when SMTP credentials are missing", async () => {
    delete process.env.SMTP_HOST
    await expect(send(contact())).rejects.toThrow(/SMTP configuration incomplete/)
  })

  it("strips CR/LF from the replyTo header to prevent header injection", async () => {
    await send(contact({ name: "Jane\r\nBcc: victim@example.com" }))
    const replyTo = sendMail.mock.calls[0][0].replyTo as string
    expect(replyTo).not.toContain("\r")
    expect(replyTo).not.toContain("\n")
  })
})
