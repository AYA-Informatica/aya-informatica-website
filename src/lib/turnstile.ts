import { logger } from "@/lib/logger"

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY

if (!TURNSTILE_SECRET && process.env.NODE_ENV === "production") {
  logger.warn("TURNSTILE_SECRET_KEY not set — captcha verification is disabled in production")
}

export async function verifyTurnstile(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) return true

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      secret: TURNSTILE_SECRET,
      response: token,
    }),
  })

  const data = await res.json() as { success: boolean }
  return data.success
}
