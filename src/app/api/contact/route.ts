import { NextRequest, NextResponse } from "next/server"
import { contactSchema } from "@/lib/validations"
import { sendContactEmail } from "@/lib/mailer"
import { verifyTurnstile } from "@/lib/turnstile"
import { logger } from "@/lib/logger"

/**
 * POST /api/contact
 *
 * Fully self-owned email delivery — no Formspree, no paid third-party.
 * Uses Nodemailer over SMTP (works with Gmail, Outlook, Zoho, Resend, etc.)
 *
 * Required env vars (see .env.local.example):
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO
 */

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"

  try {
    // ── 1. Payload size guard ─────────────────────────────
    const contentLength = req.headers.get("content-length")
    if (contentLength && parseInt(contentLength, 10) > 10_000) {
      logger.warn("Contact API: oversized payload rejected", { size: contentLength, ip })
      return NextResponse.json({ error: "Payload too large" }, { status: 413 })
    }

    // ── 2. Parse JSON safely ──────────────────────────────
    let body: unknown
    try {
      body = await req.json()
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    // ── 3. Honeypot check — bots fill hidden fields ───────
    // The client sends an extra `_honey` field that real users never see.
    if (typeof body === "object" && body !== null && "_honey" in body) {
      const honey = (body as Record<string, unknown>)._honey
      if (honey && String(honey).length > 0) {
        // Silently accept — don't tell bots they were caught
        logger.info("Contact API: honeypot triggered (bot detected)", { ip })
        return NextResponse.json({ success: true }, { status: 200 })
      }
    }

    // ── 4. Turnstile verification (when configured) ───────
    if (process.env.TURNSTILE_SECRET_KEY && typeof body === "object" && body !== null) {
      const token = (body as Record<string, unknown>)["cf-turnstile-response"]
      if (!token || typeof token !== "string") {
        return NextResponse.json({ error: "Captcha verification required" }, { status: 400 })
      }
      const valid = await verifyTurnstile(token)
      if (!valid) {
        logger.warn("Contact API: Turnstile verification failed", { ip })
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 })
      }
    }

    // ── 5. Zod validation ─────────────────────────────────
    const parsed = contactSchema.safeParse(body)
    if (!parsed.success) {
      logger.warn("Contact API: validation failed", {
        issues: parsed.error.flatten(),
        ip,
      })
      return NextResponse.json(
        { error: "Validation failed", fields: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    // ── 6. Send email via Nodemailer ──────────────────────
    const result = await sendContactEmail(parsed.data)

    logger.info("Contact API: email sent successfully", {
      messageId: result.messageId,
      subject: parsed.data.subject,
    })

    return NextResponse.json({ success: true }, { status: 200 })

  } catch (err) {
    // Log full details internally — never leak to client
    logger.error("Contact API: unhandled exception", {
      error: err instanceof Error ? err.message : String(err),
      ip,
    })
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    )
  }
}
