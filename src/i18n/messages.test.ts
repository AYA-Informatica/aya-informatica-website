import { describe, expect, it } from "vitest"
import { locales, defaultLocale } from "./config"
import en from "./messages/en.json"
import fr from "./messages/fr.json"
import rw from "./messages/rw.json"

type Messages = Record<string, unknown>

const catalogues: Record<string, Messages> = { en, fr, rw }

/** Every leaf key, flattened to dotted paths: `home.badge`, `blog.posts.x.title`. */
function flatten(value: unknown, prefix = ""): string[] {
  if (Array.isArray(value)) return [prefix]
  if (value === null || typeof value !== "object") return [prefix]
  return Object.entries(value as Messages).flatMap(([key, child]) =>
    flatten(child, prefix ? `${prefix}.${key}` : key)
  )
}

/** ICU placeholders such as `{minutes}` used inside a message. */
function placeholders(value: string): string[] {
  return [...value.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort()
}

function valueAt(messages: Messages, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Messages)[key]
    return undefined
  }, messages)
}

const referenceKeys = flatten(en).sort()
const translatedLocales = locales.filter((l) => l !== defaultLocale)

describe("message catalogues", () => {
  it("covers every configured locale", () => {
    for (const locale of locales) {
      expect(catalogues[locale], `missing catalogue for "${locale}"`).toBeDefined()
    }
  })

  it("has a non-trivial reference catalogue", () => {
    // Guards against the flatten helper silently returning nothing.
    expect(referenceKeys.length).toBeGreaterThan(100)
  })

  describe.each(translatedLocales)("%s", (locale) => {
    const keys = flatten(catalogues[locale]).sort()

    it("defines every key present in the reference locale", () => {
      const missing = referenceKeys.filter((k) => !keys.includes(k))
      expect(missing, `missing keys in ${locale}.json`).toEqual([])
    })

    it("defines no keys absent from the reference locale", () => {
      // Extra keys are dead weight and usually a rename that was only half applied.
      const extra = keys.filter((k) => !referenceKeys.includes(k))
      expect(extra, `stale keys in ${locale}.json`).toEqual([])
    })

    it("has no empty values", () => {
      const empty = keys.filter((k) => {
        const v = valueAt(catalogues[locale], k)
        return typeof v === "string" && v.trim() === ""
      })
      expect(empty, `empty values in ${locale}.json`).toEqual([])
    })

    it("preserves array lengths so feature lists stay aligned", () => {
      const mismatched = referenceKeys.filter((k) => {
        const reference = valueAt(en, k)
        if (!Array.isArray(reference)) return false
        const translated = valueAt(catalogues[locale], k)
        return !Array.isArray(translated) || translated.length !== reference.length
      })
      expect(mismatched, `array length mismatch in ${locale}.json`).toEqual([])
    })

    it("keeps the same ICU placeholders as the reference locale", () => {
      // A dropped {minutes} renders a literal placeholder or throws at runtime.
      const mismatched = referenceKeys.filter((k) => {
        const reference = valueAt(en, k)
        const translated = valueAt(catalogues[locale], k)
        if (typeof reference !== "string" || typeof translated !== "string") return false
        return placeholders(reference).join() !== placeholders(translated).join()
      })
      expect(mismatched, `placeholder mismatch in ${locale}.json`).toEqual([])
    })
  })
})
