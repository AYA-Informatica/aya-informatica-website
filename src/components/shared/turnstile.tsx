"use client"

import Script from "next/script"

/**
 * Cloudflare Turnstile widget.
 *
 * Renders only when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set. The API route
 * likewise only enforces verification when both this key and the server-side
 * secret are present, so captcha is either fully on or fully off — it can never
 * be half-enabled in a way that rejects genuine submissions.
 *
 * Uses Cloudflare's implicit rendering: the script finds elements with the
 * `cf-turnstile` class and injects a hidden `cf-turnstile-response` input into
 * the surrounding form, which the submit handler reads.
 */

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

export const isTurnstileEnabled = Boolean(SITE_KEY)

/** Reset the widget so a fresh token is issued — tokens are single-use. */
export function resetTurnstile() {
  if (typeof window === "undefined") return
  const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile
  turnstile?.reset()
}

/** Read the token Cloudflare injected into the form, if any. */
export function readTurnstileToken(): string | null {
  if (typeof document === "undefined") return null
  const input = document.querySelector<HTMLInputElement>(
    'input[name="cf-turnstile-response"]'
  )
  return input?.value || null
}

export function TurnstileWidget() {
  if (!SITE_KEY) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="lazyOnload"
      />
      <div
        className="cf-turnstile"
        data-sitekey={SITE_KEY}
        data-theme="light"
        data-appearance="interaction-only"
      />
    </>
  )
}
