import nodemailer from "nodemailer"
import type { ContactSchema } from "@/lib/validations"

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
 * SMTP_FROM       display name + address, e.g. "AYA Informatica <noreply@ayainformatica.com>"
 * CONTACT_TO      destination address, e.g. ay.company.andy@gmail.com
 */

function createTransporter() {
  const host = process.env.SMTP_HOST
  const port = parseInt(process.env.SMTP_PORT ?? "587", 10)
  const user = process.env.SMTP_USER
  const pass = process.env.SMTP_PASS

  if (!host || !user || !pass) {
    throw new Error("SMTP configuration incomplete — check SMTP_HOST, SMTP_USER, SMTP_PASS in .env.local")
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // SSL for 465, STARTTLS for 587
    auth: { user, pass },
    // Connection timeout (ms) — fail fast rather than hang
    connectionTimeout: 10_000,
    greetingTimeout: 8_000,
  })
}

export interface SendContactEmailResult {
  success: true
  messageId: string
}

export async function sendContactEmail(
  data: ContactSchema
): Promise<SendContactEmailResult> {
  const transporter = createTransporter()
  const from = process.env.SMTP_FROM ?? `"AYA Informatica" <${process.env.SMTP_USER}>`
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

  // ── Plain-text version ────────────────────────────────────
  const text = [
    `New contact form submission — AYA Informatica`,
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
            <p style="margin:4px 0 0;font-size:11px;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:4px;">Informatica</p>
          </td>
        </tr>

        <!-- Subject banner -->
        <tr>
          <td style="background:#0A84FF;padding:12px 32px;">
            <p style="margin:0;font-size:13px;font-weight:600;color:#ffffff;">${subjectLabel}</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            <p style="margin:0 0 24px;font-size:14px;color:#A0A0A0;line-height:1.6;">
              A new message was submitted through the AYA Informatica contact form.
            </p>

            <!-- Sender details -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F5F5;border-radius:8px;padding:20px;margin-bottom:24px;">
              <tr>
                <td style="padding:6px 0;">
                  <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Name</span><br/>
                  <span style="font-size:15px;color:#1A1A1A;font-weight:500;">${data.name}</span>
                </td>
              </tr>
              <tr><td style="padding:6px 0;border-top:1px solid #E8E8E8;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Email</span><br/>
                <a href="mailto:${data.email}" style="font-size:15px;color:#0A84FF;font-weight:500;text-decoration:none;">${data.email}</a>
              </td></tr>
              ${data.phone ? `<tr><td style="padding:6px 0;border-top:1px solid #E8E8E8;">
                <span style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Phone</span><br/>
                <a href="tel:${data.phone}" style="font-size:15px;color:#0A84FF;font-weight:500;text-decoration:none;">${data.phone}</a>
              </td></tr>` : ""}
            </table>

            <!-- Message -->
            <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#A0A0A0;font-weight:600;">Message</p>
            <div style="background:#F5F5F5;border-left:3px solid #0A84FF;border-radius:0 8px 8px 0;padding:16px 20px;">
              <p style="margin:0;font-size:14px;color:#1A1A1A;line-height:1.75;white-space:pre-wrap;">${data.message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>

            <!-- Reply CTA -->
            <div style="margin-top:28px;text-align:center;">
              <a href="mailto:${data.email}?subject=Re: ${subjectLabel}"
                 style="display:inline-block;background:#0A84FF;color:#ffffff;font-size:14px;font-weight:600;padding:12px 28px;border-radius:8px;text-decoration:none;">
                Reply to ${data.name.split(" ")[0]}
              </a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;border-top:1px solid #E8E8E8;">
            <p style="margin:0;font-size:11px;color:#A0A0A0;">
              Sent via ayainformatica.com contact form · ${new Date().toUTCString()}
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

  const info = await transporter.sendMail({
    from,
    to,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: `[AYA Contact] ${subjectLabel} — ${data.name}`,
    text,
    html,
  })

  return { success: true, messageId: info.messageId }
}
