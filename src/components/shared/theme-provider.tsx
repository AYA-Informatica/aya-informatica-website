"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 * Theme context and the pre-paint theme script.
 *
 * The script next-themes injects is the reason this is worth a dependency. Every
 * page here is prerendered and served from the CDN, so the HTML cannot carry a
 * theme class — the build has no idea what any given visitor prefers. Without a
 * blocking script in `<head>`, the browser paints the light theme, React then
 * hydrates and adds `.dark`, and a dark-mode visitor sees a white flash first.
 *
 * `disableTransitionOnChange` suppresses colour transitions during the switch,
 * so toggling does not animate every surface on the page at once.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  )
}
