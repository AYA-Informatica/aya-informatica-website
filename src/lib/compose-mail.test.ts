import { describe, expect, it } from "vitest"
import {
  CONTACT_EMAIL,
  buildMailDraft,
  draftAsText,
  gmailUrl,
  isDraftTooLongForMailto,
  mailtoUrl,
  outlookUrl,
  sanitizeSubject,
  type ComposeLabels,
} from "./compose-mail"

const LABELS: ComposeLabels = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  topic: "Topic",
  sentFrom: "Sent from",
}

const INPUT = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+250 787 891 746",
  subjectLabel: "Partnership",
  message: "I would like to discuss a partnership with AYA Informatica RW.",
}

describe("sanitizeSubject", () => {
  it("removes CR and LF so a subject cannot span lines", () => {
    const dirty = "Partnership\r\nBcc: attacker@evil.test"
    const clean = sanitizeSubject(dirty)
    expect(clean).not.toContain("\r")
    expect(clean).not.toContain("\n")
    expect(clean).toBe("Partnership Bcc: attacker@evil.test")
  })

  it("strips other control characters", () => {
    expect(sanitizeSubject("a" + String.fromCharCode(0) + "bc")).toBe("abc")
  })

  it("collapses whitespace runs and trims", () => {
    expect(sanitizeSubject("  a \t\t b  ")).toBe("a b")
  })

  it("keeps non-ASCII text intact", () => {
    expect(sanitizeSubject("Références — Kinyarwanda")).toBe("Références — Kinyarwanda")
  })
})

describe("buildMailDraft", () => {
  it("addresses the draft to the contact inbox", () => {
    expect(buildMailDraft(INPUT, LABELS).to).toBe(CONTACT_EMAIL)
  })

  it("builds a subject carrying the topic and the sender", () => {
    expect(buildMailDraft(INPUT, LABELS).subject).toBe(
      "[AYA Contact] Partnership — Ada Lovelace"
    )
  })

  it("lays the fields out in an aligned block above the message", () => {
    const { body } = buildMailDraft(INPUT, LABELS)
    // "Email"/"Phone"/"Topic" are the longest labels, so every value starts at
    // the same column and "Name:" carries the extra space.
    expect(body).toContain("Name:  Ada Lovelace")
    expect(body).toContain("Email: ada@example.com")
    expect(body).toContain("Phone: +250 787 891 746")
    expect(body).toContain("Topic: Partnership")
    expect(body).toContain(INPUT.message)
    expect(body.trimEnd().endsWith("Sent from ayainformatica.tech")).toBe(true)
  })

  it("omits the phone row when no phone was given", () => {
    const { body } = buildMailDraft({ ...INPUT, phone: undefined }, LABELS)
    expect(body).not.toContain("Phone")
    expect(body).toContain("Email: ada@example.com")
  })

  it("omits the phone row when the phone is only whitespace", () => {
    const { body } = buildMailDraft({ ...INPUT, phone: "   " }, LABELS)
    expect(body).not.toContain("Phone")
  })

  it("aligns to the longest label, so translated labels still line up", () => {
    const fr: ComposeLabels = {
      name: "Nom",
      email: "Adresse e-mail",
      phone: "Téléphone",
      topic: "Sujet",
      sentFrom: "Envoyé depuis",
    }
    const { body } = buildMailDraft(INPUT, fr)
    const columns = body
      .split("\n")
      .slice(0, 4)
      .map((line) => line.indexOf(line.trimStart().split(/:\s+/)[1] ?? ""))
    expect(new Set(columns).size).toBe(1)
  })

  it("normalises CRLF in the message body", () => {
    const { body } = buildMailDraft({ ...INPUT, message: "one\r\ntwo\rthree" }, LABELS)
    expect(body).toContain("one\ntwo\nthree")
    expect(body).not.toContain("\r")
  })

  it("keeps the message's own paragraph breaks", () => {
    const { body } = buildMailDraft({ ...INPUT, message: "para one\n\npara two" }, LABELS)
    expect(body).toContain("para one\n\npara two")
  })

  it("strips control characters from the message without eating newlines", () => {
    const msg = "a" + String.fromCharCode(0) + "b" + String.fromCharCode(10) + "c"
    const { body } = buildMailDraft({ ...INPUT, message: msg }, LABELS)
    expect(body).toContain("ab" + String.fromCharCode(10) + "c")
  })
})

describe("provider URLs", () => {
  const draft = buildMailDraft(INPUT, LABELS)

  it("mailto targets the contact address and encodes spaces as %20", () => {
    const url = mailtoUrl(draft)
    expect(url.startsWith(`mailto:${CONTACT_EMAIL}?`)).toBe(true)
    expect(url).not.toContain("+")
    expect(url).toContain("%20")
  })

  it("mailto round-trips the subject and body intact", () => {
    const url = mailtoUrl(draft)
    const params = new URLSearchParams(url.slice(url.indexOf("?") + 1))
    expect(params.get("subject")).toBe(draft.subject)
    expect(params.get("body")).toBe(draft.body)
  })

  it("gmail uses the compose view and carries the draft", () => {
    const params = new URL(gmailUrl(draft)).searchParams
    expect(params.get("view")).toBe("cm")
    expect(params.get("to")).toBe(CONTACT_EMAIL)
    expect(params.get("su")).toBe(draft.subject)
    expect(params.get("body")).toBe(draft.body)
  })

  it("outlook points at its compose deeplink and carries the draft", () => {
    const url = new URL(outlookUrl(draft))
    expect(url.hostname).toBe("outlook.live.com")
    expect(url.searchParams.get("to")).toBe(CONTACT_EMAIL)
    expect(url.searchParams.get("body")).toBe(draft.body)
  })

  it("every provider URL is absolute and well-formed", () => {
    expect(() => new URL(gmailUrl(draft))).not.toThrow()
    expect(() => new URL(outlookUrl(draft))).not.toThrow()
    expect(() => new URL(mailtoUrl(draft))).not.toThrow()
  })

  it("does not let a crafted field break out of its parameter", () => {
    const hostile = buildMailDraft(
      { ...INPUT, name: "Ada&body=OWNED", message: "hi&to=attacker@evil.test" },
      LABELS
    )
    const params = new URLSearchParams(mailtoUrl(hostile).split("?")[1])
    expect(params.get("body")).toContain("hi&to=attacker@evil.test")
    expect([...params.keys()].sort()).toEqual(["body", "subject"])
  })
})

describe("draft length", () => {
  it("accepts an ordinary submission", () => {
    expect(isDraftTooLongForMailto(buildMailDraft(INPUT, LABELS))).toBe(false)
  })

  it("flags a maximal message, which the schema still allows", () => {
    // The schema caps the message at 2000 characters; percent-encoding pushes a
    // message that long past what Windows will hand to a mail client.
    const draft = buildMailDraft({ ...INPUT, message: "x".repeat(2000) }, LABELS)
    expect(isDraftTooLongForMailto(draft)).toBe(true)
  })
})

describe("draftAsText", () => {
  it("includes the recipient, subject and body for pasting", () => {
    const draft = buildMailDraft(INPUT, LABELS)
    const text = draftAsText(draft)
    expect(text).toContain(CONTACT_EMAIL)
    expect(text).toContain(draft.subject)
    expect(text).toContain(INPUT.message)
  })
})
