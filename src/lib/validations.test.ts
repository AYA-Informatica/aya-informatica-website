import { describe, expect, it } from "vitest"
import { contactSchema } from "./validations"

/**
 * A valid baseline payload. Individual tests override single fields so each
 * assertion isolates one rule.
 */
function payload(overrides: Record<string, unknown> = {}) {
  return {
    name: "Jane Doe",
    email: "Jane.Doe@Example.COM",
    phone: "+250 787 891 746",
    subject: "partnership",
    message: "I would like to discuss a partnership opportunity with your team.",
    ...overrides,
  }
}

describe("contactSchema — sanitization ordering", () => {
  // These cases are the core defect: sanitization must run BEFORE the length
  // checks. If it runs after (a plain .transform()), a payload made entirely
  // of markup satisfies .min() on its raw length and then collapses to an
  // empty string — producing a "valid" submission with no content.

  it("rejects a name that is only HTML tags", () => {
    // 7 raw characters clears min(2), but sanitizes to "".
    const result = contactSchema.safeParse(payload({ name: "<b></b>" }))
    expect(result.success).toBe(false)
  })

  it("rejects a message that is only HTML tags", () => {
    // 28 raw characters clears min(20), but sanitizes to "".
    const result = contactSchema.safeParse(
      payload({ message: "<b></b><i></i><u></u><s></s>" })
    )
    expect(result.success).toBe(false)
  })

  it("rejects a message whose real content is under the minimum once stripped", () => {
    // Raw length 38 clears min(20); real text is "Hi" (2 chars).
    const result = contactSchema.safeParse(
      payload({ message: "<div><span><em>Hi</em></span></div>" })
    )
    expect(result.success).toBe(false)
  })

  it("rejects whitespace-only input that clears the raw minimum", () => {
    const result = contactSchema.safeParse(payload({ name: "        " }))
    expect(result.success).toBe(false)
  })

  it("enforces the maximum against sanitized length, not raw length", () => {
    // Real content is well within 2000; the markup inflates raw length past it.
    const realText = "a".repeat(1500)
    const result = contactSchema.safeParse(
      payload({ message: `<p>${"<span>".repeat(100)}${realText}</p>` })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toBe(realText)
    }
  })
})

describe("contactSchema — stripHtml hardening", () => {
  it("removes residual angle brackets from unclosed tags", () => {
    // The tag regex requires a closing ">", so an unclosed tag survives it.
    // No raw "<" should reach the email template.
    const result = contactSchema.safeParse(
      payload({ message: "Please review this <img src=x onerror=alert(1) attack attempt" })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).not.toContain("<")
      expect(result.data.message).not.toContain(">")
    }
  })

  it("strips a script tag and its angle brackets entirely", () => {
    const result = contactSchema.safeParse(
      payload({ message: "Hello there <script>alert('xss')</script> I am interested." })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).not.toContain("<")
      expect(result.data.message).not.toContain("script>")
    }
  })

  it("strips the javascript: protocol", () => {
    const result = contactSchema.safeParse(
      payload({ message: "Check out javascript:alert(1) this interesting link please." })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message.toLowerCase()).not.toContain("javascript:")
    }
  })

  it("strips inline event handlers", () => {
    const result = contactSchema.safeParse(
      payload({ message: "Some text onerror= and onclick= handlers should not survive." })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).not.toMatch(/on\w+\s*=/i)
    }
  })

  it("preserves legitimate prose containing inline markup", () => {
    const result = contactSchema.safeParse(
      payload({ message: "I want to discuss <b>partnership</b> options with your team." })
    )
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.message).toBe(
        "I want to discuss partnership options with your team."
      )
    }
  })
})

describe("contactSchema — field rules", () => {
  it("accepts a valid payload", () => {
    const result = contactSchema.safeParse(payload())
    expect(result.success).toBe(true)
  })

  it("normalizes email to lowercase", () => {
    const result = contactSchema.safeParse(payload())
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe("jane.doe@example.com")
    }
  })

  it("rejects a malformed email", () => {
    expect(contactSchema.safeParse(payload({ email: "not-an-email" })).success).toBe(false)
  })

  it("treats phone as optional", () => {
    expect(contactSchema.safeParse(payload({ phone: undefined })).success).toBe(true)
  })

  it("rejects a phone number containing letters", () => {
    expect(contactSchema.safeParse(payload({ phone: "call-me-maybe" })).success).toBe(false)
  })

  it("rejects a subject outside the allowlist", () => {
    expect(contactSchema.safeParse(payload({ subject: "arbitrary" })).success).toBe(false)
  })

  it.each(["partnership", "ray-access", "humura", "services", "investment", "other"])(
    "accepts the allowlisted subject %s",
    (subject) => {
      expect(contactSchema.safeParse(payload({ subject })).success).toBe(true)
    }
  )

  it("rejects a name over the maximum length", () => {
    expect(contactSchema.safeParse(payload({ name: "a".repeat(81) })).success).toBe(false)
  })

  it("rejects a message over the maximum length", () => {
    expect(contactSchema.safeParse(payload({ message: "a".repeat(2001) })).success).toBe(false)
  })

  it("rejects missing required fields", () => {
    expect(contactSchema.safeParse({}).success).toBe(false)
  })
})
