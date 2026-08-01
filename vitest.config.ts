import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"

export default defineConfig({
  // Resolves the `@/*` alias from tsconfig.json so tests import the same
  // specifiers the app does.
  plugins: [tsconfigPaths()],
  test: {
    // Node environment: the units under test (validation, mailer, turnstile,
    // route handlers) are all server-side. A jsdom project can be added
    // alongside this one if component tests are introduced later.
    environment: "node",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/app/api/**", "src/i18n/**"],
      reporter: ["text", "html"],
    },
  },
})
