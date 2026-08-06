/**
 * Builds a pre-filled email draft from a contact submission.
 *
 * This is the escape hatch for when the site cannot send the message itself —
 * SMTP unconfigured, the endpoint rate-limited, the network down. Rather than
 * losing what the visitor typed, we hand it to their own mail client with every
 * field already laid out, so all that is left is to press send.
 *
 * Nothing here talks to the network. It only produces URLs.
 */

/** Where contact mail goes. Matches CONTACT_TO in the server-side mailer. */
export const CONTACT_EMAIL = "ay.company.andy@gmail.com"

export interface MailDraft {
  to: string
  subject: string
  body: string
}

export interface ComposeInput {
  name: string
  email: string
  phone?: string
  /** The selected topic, already resolved to its display label. */
  subjectLabel: string
  message: string
}

/** Labels for the body's field block, so a translated draft stays aligned. */
export interface ComposeLabels {
  name: string
  email: string
  phone: string
  topic: string
  sentFrom: string
}

const TAB = 9
const LINE_FEED = 10
const CARRIAGE_RETURN = 13
const SPACE = 32
const DELETE = 127

/**
 * Drops C0 control characters, keeping only the ones passed in `keep`.
 *
 * Written as a codepoint filter rather than a regex range: the equivalent
 * character class has to be spelled with escapes to stay readable, and an
 * unescaped literal in the source is invisible to review and easy to mangle in
 * an editor. This says what it means.
 */
function stripControls(value: string, keep: number[] = []): string {
  let out = ""
  for (const char of value) {
    const code = char.codePointAt(0)!
    if (code >= SPACE && code !== DELETE) out += char
    else if (keep.includes(code)) out += char
  }
  return out
}

/**
 * Strips characters that have no business in a mail header.
 *
 * `mailto:` params are percent-encoded, so a newline cannot break out on a
 * conformant client. Not every client is conformant, and a subject line
 * containing CR or LF has no legitimate use, so it is removed rather than
 * relied upon to be encoded safely. Runs of whitespace are collapsed, which
 * would otherwise render as a ragged subject.
 */
export function sanitizeSubject(value: string): string {
  return stripControls(value, [TAB, LINE_FEED, CARRIAGE_RETURN])
    .replace(/\s+/g, " ")
    .trim()
}

/** Normalises line endings and strips control characters except newlines. */
function sanitizeBody(value: string): string {
  return stripControls(value.replace(/\r\n?/g, "\n"), [LINE_FEED])
}

/**
 * Lays the submission out as plain text.
 *
 * Field labels are padded to a common width so the block reads as a table in a
 * monospaced client and still scans cleanly in a proportional one. Padding is
 * computed from the labels actually passed in, so it survives translation —
 * the French and Kinyarwanda labels are longer than the English ones.
 */
export function buildMailDraft(
  input: ComposeInput,
  labels: ComposeLabels,
  siteName = "ayainformatica.tech"
): MailDraft {
  const rows: [string, string][] = [
    [labels.name, input.name],
    [labels.email, input.email],
  ]
  if (input.phone?.trim()) rows.push([labels.phone, input.phone.trim()])
  rows.push([labels.topic, input.subjectLabel])

  const width = Math.max(...rows.map(([label]) => label.length)) + 1
  const fields = rows
    .map(([label, value]) => `${(label + ":").padEnd(width)} ${value}`)
    .join("\n")

  const body = [
    fields,
    "",
    sanitizeBody(input.message).trim(),
    "",
    "—",
    `${labels.sentFrom} ${siteName}`,
  ].join("\n")

  return {
    to: CONTACT_EMAIL,
    subject: sanitizeSubject(`[AYA Contact] ${input.subjectLabel} — ${input.name}`),
    body,
  }
}

/**
 * The visitor's default mail application.
 *
 * Preferred over a provider-specific link: it resolves to Gmail on Android,
 * Mail on iOS, and whatever is registered on a desktop, so it is the one option
 * that is right for most people without asking them anything first.
 */
export function mailtoUrl(draft: MailDraft): string {
  const params = new URLSearchParams({ subject: draft.subject, body: draft.body })
  // URLSearchParams encodes a space as "+", which is correct for a query string
  // but is shown literally by several mail clients in the subject line.
  return `mailto:${draft.to}?${params.toString().replace(/\+/g, "%20")}`
}

/** Gmail's web composer, for someone whose desktop has no mail app configured. */
export function gmailUrl(draft: MailDraft): string {
  const params = new URLSearchParams({
    view: "cm",
    fs: "1",
    to: draft.to,
    su: draft.subject,
    body: draft.body,
  })
  return `https://mail.google.com/mail/?${params.toString()}`
}

/** Outlook on the web, same purpose as the Gmail link. */
export function outlookUrl(draft: MailDraft): string {
  const params = new URLSearchParams({
    path: "/mail/action/compose",
    to: draft.to,
    subject: draft.subject,
    body: draft.body,
  })
  return `https://outlook.live.com/mail/0/deeplink/compose?${params.toString()}`
}

/** The whole draft as text, for the copy-to-clipboard escape hatch. */
export function draftAsText(draft: MailDraft): string {
  return `${draft.to}\n${draft.subject}\n\n${draft.body}`
}

/**
 * Long drafts do not survive every mail client.
 *
 * `mailto:` has no length limit in the spec, but Windows caps the command line
 * it uses to launch the handler at roughly 2000 characters, and a longer URL is
 * silently truncated rather than rejected. The message field allows 2000
 * characters on its own, so a maximal submission can cross that line. When it
 * does, copying the draft is the reliable path and the UI says so.
 */
export const MAILTO_SAFE_LENGTH = 1800

export function isDraftTooLongForMailto(draft: MailDraft): boolean {
  return mailtoUrl(draft).length > MAILTO_SAFE_LENGTH
}
