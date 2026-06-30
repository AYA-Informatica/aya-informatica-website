export const locales = ["en", "fr", "rw"] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  rw: "Kinyarwanda",
}
