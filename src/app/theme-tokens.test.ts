import { readdirSync, readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

/**
 * Guards the semantic colour tokens.
 *
 * A token defined in `:root` but forgotten in `.dark` does not fail the build,
 * does not fail typecheck, and does not throw at runtime — the utility simply
 * inherits the light value and renders an unreadable element in dark mode.
 * This asserts the two blocks stay in step, and that the pairs the markup
 * actually renders clear WCAG AA in both themes.
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

const THEMES = [
  ["light", light],
  ["dark", dark],
] as const

/** WCAG 2.1 relative luminance, from "r g b" channels. */
function relativeLuminance(triplet: string): number {
  const channel = (c: number) => {
    const n = c / 255
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4)
  }
  const [r, g, b] = triplet.split(/\s+/).map(Number)
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

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
    for (const [theme, tokens] of THEMES) {
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

  it("keeps text legible on every surface, in both themes", () => {
    // The pairs the markup actually renders. AA is 4.5:1 for normal text, and
    // most of this text is small. Written out rather than derived, so that
    // adding a surface without deciding what text sits on it is a visible gap.
    const PAIRS: [string, string, string][] = [
      ["body on page", "--content", "--surface"],
      ["body on card", "--content", "--surface-raised"],
      ["headings on page", "--content-strong", "--surface"],
      ["muted on page", "--content-muted", "--surface"],
      ["muted on card", "--content-muted", "--surface-raised"],
      ["accent on page", "--brand-accent", "--surface"],
      ["accent on card", "--brand-accent", "--surface-raised"],
      ["text on the bands", "--content-on-inverse", "--surface-inverse"],
      ["accent on the bands", "--brand-accent-on-inverse", "--surface-inverse"],
      // Why --accent-contrast exists: the accent is dark in light mode and
      // light in dark mode, so a fixed white label fails in one of the two.
      ["label on an accent fill", "--accent-contrast", "--brand-accent"],
    ]

    for (const [theme, t] of THEMES) {
      for (const [what, fg, bg] of PAIRS) {
        expect(contrast(t.get(fg)!, t.get(bg)!), `${theme}: ${what}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it("keeps form-control borders identifiable, in both themes", () => {
    // WCAG 1.4.11 asks for 3:1 on the boundary that identifies a control.
    // Inputs are filled with --surface and sit on --surface-raised, a 1.09:1
    // difference, so the border is the only thing marking them out.
    for (const [theme, t] of THEMES) {
      for (const bg of ["--surface", "--surface-raised"] as const) {
        expect(
          contrast(t.get("--border-control")!, t.get(bg)!),
          `${theme}: control border on ${bg}`
        ).toBeGreaterThanOrEqual(3)
      }
    }
  })

  it("never pairs text-white with an accent fill", () => {
    // `bg-accent text-white` reads at 2.87:1 in dark mode, where the accent
    // lightens. `text-on-accent` is the paired foreground and flips with it.
    // readdirSync rather than fs.globSync: the latter exists on this Node but
    // not in the installed @types/node, so it typechecks red.
    const files = readdirSync("src", { recursive: true, encoding: "utf8" })
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => `src/${f}`)

    const offenders: string[] = []
    for (const file of files) {
      for (const [line] of readFileSync(file, "utf8").matchAll(/^.*\bbg-accent\b(?!\/).*$/gm)) {
        // `(?!\/)` matters: a line can legitimately carry `bg-accent` in one
        // ternary branch and `text-white/55` in the other, and an opacity-
        // modified white is never the label on an accent fill.
        if (/\btext-white\b(?!\/)/.test(line)) offenders.push(`${file}: ${line.trim()}`)
      }
    }
    expect(offenders, "accent fills must use text-on-accent").toEqual([])
  })

  it("keeps the inverse surface dark in both themes", () => {
    // The navy bands are the brand and stay dark whichever theme is active.
    // That is what lets the `text-white/*` inside them go untouched — if this
    // ever became light, all of that text would turn invisible.
    expect(relativeLuminance(light.get("--surface-inverse")!)).toBeLessThan(0.1)
    expect(relativeLuminance(dark.get("--surface-inverse")!)).toBeLessThan(0.1)
  })
})
