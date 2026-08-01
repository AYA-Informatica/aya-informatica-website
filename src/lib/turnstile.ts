import { logger } from "@/lib/logger"

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

/** Cloudflare is given this long to answer before the request is abandoned. */
const VERIFY_TIMEOUT_MS = 5_000

if (!TURNSTILE_SECRET && process.env.NODE_ENV === "production") {
  logger.warn("TURNSTILE_SECRET_KEY not set — captcha verification is disabled in production")
}

/**
 * Verify a Turnstile token with Cloudflare.
 *
 * Failure policy: **fail open**. If Cloudflare is unreachable, slow, or returns
 * something unparseable, this resolves `true` and logs a warning rather than
 * rejecting the submission. A captcha outage would otherwise take the contact
 * form down entirely; the honeypot and the IP rate limiter still apply, so the
 * cost is reduced spam protection during an outage rather than lost enquiries.
 *
 * A definite `success: false` from Cloudflare is an answer, not an outage, and
 * is always honoured.
 */
export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
      }),
      // Without this the request can hang for the full function timeout.
      signal: AbortSignal.timeout(VERIFY_TIMEOUT_MS),
    })

    if (!res.ok) {
      logger.warn("Turnstile verification unavailable — allowing submission", {
        status: res.status,
      })
      return true
    }

    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch (err) {
    logger.warn("Turnstile verification failed to complete — allowing submission", {
      error: err instanceof Error ? err.message : String(err),
    })
    return true
  }
}
