import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * Guards the semantic colour tokens.
 *
 * A token defined in `:root` but forgotten in `.dark` does not fail the build,
 * does not fail typecheck, and does not throw at runtime — the utility simply
 * inherits the light value and renders an unreadable element in dark mode.
 * This asserts the two blocks stay in step.
 */

const css = readFileSync("src/app/globals.css", "utf8")

/** Pull `--token: r g b;` declarations out of a named block. */
function tokensIn(selector: string): Map<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const block = new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n  \\}`, "m").exec(css)
  if (!block) throw new Error(`could not locate the "${selector}" block in globals.css`)

  const found = new Map<string, string>()
  for (const [, name, value] of block[1].matchAll(/(--[a-z-]+):\s*([^;]+);/g)) {
    found.set(name, value.trim())
  }
  return found
}

/** Colour tokens are RGB channel triplets; the others are fonts and sizes. */
function colourTokens(all: Map<string, string>): Map<string, string> {
  return new Map([...all].filter(([, v]) => /^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/.test(v)))
}

const light = colourTokens(tokensIn(":root"))
const dark = colourTokens(tokensIn(".dark"))

describe("semantic colour tokens", () => {
  it("defines a non-trivial set in the light theme", () => {
    expect(light.size).toBeGreaterThanOrEqual(9)
  })

  it("defines exactly the same tokens in both themes", () => {
    const missingInDark = [...light.keys()].filter((k) => !dark.has(k))
    const missingInLight = [...dark.keys()].filter((k) => !light.has(k))
    expect(missingInDark, "tokens missing from .dark").toEqual([])
    expect(missingInLight, "tokens missing from :root").toEqual([])
  })

  it("uses space-separated RGB channels, not hex or rgb()", () => {
    // Tailwind maps these through `rgb(var(--token) / <alpha-value>)`. A hex or
    // rgb() value here compiles but silently breaks every opacity modifier.
    // Runs of whitespace are permitted — the declarations are column-aligned
    // for readability, and CSS accepts any whitespace between rgb() channels.
    for (const [theme, tokens] of [
      ["light", light],
      ["dark", dark],
    ] as const) {
      for (const [name, value] of tokens) {
        expect(value, `${theme} ${name} must be "r g b"`).toMatch(
          /^\d{1,3}\s+\d{1,3}\s+\d{1,3}$/
        )
      }
    }
  })

  it("keeps every channel within 0–255", () => {
    for (const [name, value] of [...light, ...dark]) {
      for (const channel of value.split(/\s+/).map(Number)) {
        expect(channel, `${name} channel out of range`).toBeLessThanOrEqual(255)
        expect(channel, `${name} channel out of range`).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it("keeps the inverse surface dark in both themes", () => {
    // The navy bands are the brand and stay dark whichever theme is active.
    // That is what lets the `text-white/*` inside them go untouched — if this
    // ever became light, all of that text would turn invisible.
    const luminance = (triplet: string) => {
      const [r, g, b] = triplet.split(/\s+/).map(Number)
      return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
    }
    expect(luminance(light.get("--surface-inverse")!)).toBeLessThan(0.3)
    expect(luminance(dark.get("--surface-inverse")!)).toBeLessThan(0.3)
  })
})
