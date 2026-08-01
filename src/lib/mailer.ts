import nodemailer from "nodemailer"
import type SMTPPool from "nodemailer/lib/smtp-pool"
import type { ContactSchema } from "@/lib/validations"
import { logger } from "@/lib/logger"

/**
 * Custom email sender — zero third-party dependency, zero recurring cost.
 *
 * Uses Nodemailer with SMTP credentials you already own.
 * Works with any SMTP provider:
 *
 * ── FREE OPTIONS ──────────────────────────────────────────────
 * 1. Gmail (recommended for small volume):
 *    - Enable 2FA on your Google account
 *    - Generate an App Password: myaccount.google.com/apppasswords
 *    - SMTP_HOST=smtp.gmail.com  SMTP_PORT=587
 *    - SMTP_USER=your@gmail.com  SMTP_PASS=your-app-password
 *
 * 2. Outlook / Hotmail:
 *    - SMTP_HOST=smtp-mail.outlook.com  SMTP_PORT=587
 *    - SMTP_USER=your@outlook.com  SMTP_PASS=your-password
 *
 * 3. Zoho Mail (free tier, custom domain):
 *    - SMTP_HOST=smtp.zoho.com  SMTP_PORT=587
 *
 * ── PAID (when you scale) ─────────────────────────────────────
 * Resend (3,000 emails/month free): SMTP_HOST=smtp.resend.com
 * Mailgun, SendGrid, Postmark — all support standard SMTP
 *
 * ── ENV VARS REQUIRED ─────────────────────────────────────────
 * SMTP_HOST       e.g. smtp.gmail.com
 * SMTP_PORT       587 (STARTTLS) or 465 (SSL)
 * SMTP_USER       your sending email address
 * SMTP_PASS       your app password or SMTP password
 * SMTP_FROM       display name + address, e.g. "AYA Informatica RW <noreply@ayainformatica.tech>"
 * CONTACT_TO      destination address, e.g. ay.company.andy@gmail.com
 */

// ── Escaping helpers ──────────────────────────────────────────

/**
 * Escape a value for interpolation into the HTML email templates.
 *
 * These templates are built by string concatenation, so React's automatic
 * escaping does not apply. The Zod layer strips markup before a value reaches
 * here, but this must not depend on that: the mailer is a separate boundary and
 * any caller — or a future change to the schema — could hand it raw input.
 *
 * The ampersand must be replaced first, otherwise the entities emitted by the
 * later replacements would themselves be re-escaped.
 */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Strip CR/LF from a value destined for an email *header*.
 *
 * Without this, a name such as "Jane\r\nBcc: victim@example.com" injects an
 * additional header into the outgoing message.
 */
export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n]+/g, " ").replace(/"/g, "").trim()
}

export function validateSmtpConfig(): { valid: boolean; missing: string[] } {
  const required = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS"] as const
  const missing = required.filter((key) => !process.env[key])
  return { valid: missing.length === 0, missing }
}

// Pooled transports report a different SentMessageInfo shape than the plain
// SMTP transport, so the type is taken from the pool module.
type Transporter = nodemailer.Transporter<SMTPPool.SentMessageInfo>

// Transporters are cached for the lifetime of the module. A single submission
// sends two messages (notification + auto-reply); creating a transport per send
// opened a fresh SMTP connection for each. Pooling reuses one.
let primaryTransporter: Transporter | null = null
let fallbackTransporter: Transporter | null = null
let fallbackResolved = false

function getTransporter(): Transporter {
  if (primaryTransporter) return primaryTransporter

  const { valid, missing } = validateSmtpConfig()
  if (!valid) {
    throw new Error(`SMTP configuration incomplete — missing: ${missing.join(", ")}. Check .env.local`)
  }

  const port = parseInt(process.env.SMTP_PORT ?? "587", 10)

  primaryTransporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST!,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    connectionTimeout: 10_000,
    greetingTimeout: 8_000,
    pool: true,
    maxConnections: 3,
  })

  return primaryTransporter
}

function getFallbackTransporter(): Transporter | null {
  if (fallbackResolved) return fallbackTransporter
  fallbackResolved = true

  const host = process.env.SMTP_FALLBACK_HOST
  const user = process.env.SMTP_FALLBACK_USER
  const pass = process.env.SMTP_FALLBACK_PASS
  if (!host || !user || !pass) return null

  const port = parseInt(process.env.SMTP_FALLBACK_PORT ?? "587", 10)
  fallbackTransporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    connectionTimeout: 10_000,
    greetingTimeout: 8_000,
    pool: true,
    maxConnections: 3,
  })

  return fallbackTransporter
}

export interface SendContactEmailResult {
  success: true
  messageId: string
}

async function sendWithFallback(mailOptions: Parameters<Transporter["sendMail"]>[0]) {
  const primary = getTransporter()
  try {
    return await primary.sendMail(mailOptions)
  } catch (err) {
    const fallback = getFallbackTransporter()
    if (!fallback) throw err
    return await fallback.sendMail(mailOptions)
  }
}

export async function sendContactEmail(
  data: ContactSchema
): Promise<SendContactEmailResult> {
  const from = process.env.SMTP_FROM ?? `"AYA Informatica RW" <${process.env.SMTP_USER}>`
  const to = process.env.CONTACT_TO ?? process.env.SMTP_USER ?? ""

  const subjectLabels: Record<string, string> = {
    partnership:  "Partnership Enquiry",
    "ray-access": "RAY Early Access Request",
    humura:       "Humura Platform Enquiry",
    services:     "Service Inquiry",
    investment:   "Investment Enquiry",
    other:        "General Enquiry",
  }

  const subjectLabel = subjectLabels[data.subject] ?? "Contact Form Submission"
  const firstName = data.name.split(" ")[0] ?? data.name

  // Every value interpolated into the HTML templates below goes through
  // escapeHtml exactly once, here. Nothing else in the templates may embed a
  // raw `data.*` value.
  const safe = {
    name: escapeHtml(data.name),
    firstName: escapeHtml(firstName),
    email: escapeHtml(data.email),
    phone: data.phone ? escapeHtml(data.phone) : "",
    subjectLabel: escapeHtml(subjectLabel),
    replySubject: escapeHtml(encodeURIComponent(`Re: ${subjectLabel}`)),
  }

  // ── Plain-text version ────────────────────────────────────
  const text = [
    `New contact form submission — AYA Informatica RW`,
    ``,
    `Subject: ${subjectLabel}`,
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    `Phone:   ${data.phone ?? "Not provided"}`,
    ``,
    `Message:`,
    `─────────────────────────────────`,
    data.message,
    `─────────────────────────────────`,
    ``,
    `Submitted at: ${new Date().toISOString()}`,
  ].join("\n")

  // ── HTML version ──────────────────────────────────────────
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8E8E8;">

        <!-- Header -->
        <tr>
          <td style="background:#001529;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;">AYA</p>
            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:4px;">Informatica RW</p>
          </td>
        </tr>

        <!-- Subject banner -->
        <tr>
          <td style="background:#0A84FF;padding:12px 32px;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#ffffff;">${safe.subjectLabel}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:14px;color:#A0A0A0;line-height:1.6;">
              A new message was submitted through the AYA Informatica RW contact form.
            </p>

            <!-- Sender details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;">
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Name</span><br/>
                  <span style="font-size:15px;color:#1A1A1A;font-weight:500;">${safe.name}</span>
                </td>
              </tr>
              <tr><td style="padding:6px 0;border-top:1px solid #E8E8E8;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Email</span><br/>
                <a href="mailto:${safe.email}" style="font-size:15px;color:#0A84FF;font-weight:500;text-decoration:none;">${safe.email}</a>
              </td></tr>
              ${data.phone ? `<tr><td style="padding:6px 0;border-top:1px solid #E8E8E8;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Phone</span><br/>
                <a href="tel:${safe.phone}" style="font-size:15px;color:#0A84FF;font-weight:500;text-decoration:none;">${safe.phone}</a>
              </td></tr>` : ""}
            </table>

            <!-- Message -->
            <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Message</p>
            <div style="background:#F5F5F5;border-left:3px solid #0A84FF;border-radius:0 8px 8px 0;padding:16px 20px;">
              <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.75;white-space:pre-wrap;">${escapeHtml(data.message)}</p>
            </div>

            <!-- Reply CTA -->
            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${safe.email}?subject=${safe.replySubject}"
                 style="display:inline-block;background:#0A84FF;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Reply to ${safe.firstName}
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #E8E8E8;">
            <p style="margin:0;font-size:11px;color:#A0A0A0;">
              Sent via ayainformatica.tech contact form · ${new Date().toUTCString()}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const info = await sendWithFallback({
    from,
    to,
    // Header values are CRLF-stripped: a newline in a user-supplied name would
    // otherwise inject additional headers (e.g. an extra Bcc) into the message.
    replyTo: `"${sanitizeHeaderValue(data.name)}" <${sanitizeHeaderValue(data.email)}>`,
    subject: sanitizeHeaderValue(`[AYA Contact] ${subjectLabel} — ${data.name}`),
    text,
    html,
  })

  // Send auto-reply to the submitter
  try {
    await sendWithFallback({
      from,
      to: sanitizeHeaderValue(data.email),
      subject: `Thank you for contacting AYA Informatica RW`,
      text: [
        `Hi ${firstName},`,
        ``,
        `Thank you for reaching out to AYA Informatica RW. We've received your message and will get back to you within 24 hours.`,
        ``,
        `For reference, here's a summary of your submission:`,
        `Subject: ${subjectLabel}`,
        ``,
        `Best regards,`,
        `The AYA Informatica RW Team`,
        `Kigali, Rwanda`,
        ``,
        `---`,
        `This is an automated confirmation. Please do not reply to this email.`,
      ].join("\n"),
      html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#F5F5F5;font-family:'DM Sans',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E8E8E8;">
        <tr>
          <td style="background:#001529;padding:28px 32px;">
            <p style="margin:0;font-size:22px;font-weight:900;color:#ffffff;letter-spacing:2px;">AYA</p>
            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:4px;">Informatica RW</p>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 16px;font-size:18px;font-weight:700;color:#001529;">Thank you, ${safe.firstName}!</p>
            <p style="margin:0 0 16px;font-size:14px;color:#A0A0A0;line-height:1.6;">
              We've received your message regarding <strong style="color:#001529;">${safe.subjectLabel}</strong> and our team will review it shortly.
            </p>
            <p style="margin:0 0 24px;font-size:14px;color:#A0A0A0;line-height:1.6;">
              We typically respond within <strong style="color:#001529;">24 hours</strong>. In the meantime, feel free to explore our website for more information.
            </p>
            <div style="text-align:center;">
              <a href="https://ayainformatica.tech" style="display:inline-block;background:#0A84FF;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Visit Our Website
              </a>
            </div>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #E8E8E8;">
            <p style="margin:0;font-size:11px;color:#A0A0A0;">
              AYA Informatica RW · Kigali, Rwanda · This is an automated confirmation.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
    })
  } catch (err) {
    logger.warn("Contact auto-reply failed", {
      email: data.email,
      error: err instanceof Error ? err.message : String(err),
    })
  }

  return { success: true, messageId: info.messageId }
}
