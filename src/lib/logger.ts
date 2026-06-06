// ─────────────────────────────────────────────────────────────
// LOGGER — structured server-side logging
//
// In development: pretty-prints to console
// In production:  structured JSON (ready for Axiom / Logtail / Datadog)
//
// Usage:
//   import { logger } from "@/lib/logger"
//   logger.info("Contact form submitted", { email: "..." })
//   logger.error("Upstream failed", { status: 500 })
//
// To wire up Axiom (free tier, Next.js native):
//   npm install @axiomhq/nextjs
//   Add AXIOM_DATASET and AXIOM_TOKEN to .env.local
// ─────────────────────────────────────────────────────────────

type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  environment: string
  [key: string]: unknown
}

function formatEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? "development",
    ...meta,
  }
}

function write(level: LogLevel, message: string, meta?: Record<string, unknown>) {
  const entry = formatEntry(level, message, meta)

  if (process.env.NODE_ENV === "production") {
    // Structured JSON for log aggregation services
    const output = JSON.stringify(entry)
    if (level === "error" || level === "warn") {
      process.stderr.write(output + "\n")
    } else {
      process.stdout.write(output + "\n")
    }
  } else {
    // Human-readable in development
    const prefix = {
      debug: "\x1b[36m[DEBUG]\x1b[0m",
      info:  "\x1b[32m[INFO]\x1b[0m ",
      warn:  "\x1b[33m[WARN]\x1b[0m ",
      error: "\x1b[31m[ERROR]\x1b[0m",
    }[level]
    const metaStr = meta ? " " + JSON.stringify(meta) : ""
    console.log(`${prefix} ${entry.timestamp} ${message}${metaStr}`)
  }
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => write("debug", message, meta),
  info:  (message: string, meta?: Record<string, unknown>) => write("info",  message, meta),
  warn:  (message: string, meta?: Record<string, unknown>) => write("warn",  message, meta),
  error: (message: string, meta?: Record<string, unknown>) => write("error", message, meta),
}
