import { z } from "zod"

// ── Sanitization helpers ──────────────────────────────────────
// Strip HTML tags and dangerous characters before validation.
// This runs server-side via the API route — it's a second layer
// on top of React's default XSS escaping on the client.
function stripHtml(val: string): string {
  return val
    .replace(/<[^>]*>/g, "")          // strip HTML tags
    .replace(/javascript:/gi, "")      // strip JS protocol
    .replace(/on\w+\s*=/gi, "")        // strip event handlers (onclick=, etc.)
    .trim()
}

// Reusable sanitized string transform
const sanitizedString = (schema: z.ZodString) =>
  schema.transform((val) => stripHtml(val))

/**
 * Contact form validation schema
 * Each field is sanitized AND validated — defense in depth.
 */
export const contactSchema = z.object({
  name: sanitizedString(
    z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(80, "Name is too long")
  ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .max(254, "Email is too long") // RFC 5321 max
    .transform((val) => val.toLowerCase().trim()),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[+\d\s\-()]{7,20}$/.test(val),
      "Please enter a valid phone number"
    ),
  subject: z
    .string()
    .min(1, "Please select a subject")
    // Allowlist — only accept known enum values
    .refine(
      (val) =>
        ["partnership", "ray-access", "humura", "services", "investment", "other"].includes(val),
      "Invalid subject"
    ),
  message: sanitizedString(
    z
      .string()
      .min(20, "Message must be at least 20 characters")
      .max(2000, "Message is too long")
  ),
})

export type ContactSchema = z.infer<typeof contactSchema>
