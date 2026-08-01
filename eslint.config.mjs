import nextCoreWebVitals from "eslint-config-next/core-web-vitals"

/**
 * ESLint 9 flat config.
 *
 * Replaces the previous .eslintrc.json — `eslint-config-next@16` requires
 * ESLint >= 9, which only supports flat config. File selection now comes from
 * the `files` patterns inside the shared config rather than a `--ext` flag
 * (removed in ESLint 9), so the lint script is plain `eslint .`.
 */
const config = [
  {
    ignores: [
      ".next/**",
      ".trunk/**",
      "node_modules/**",
      "coverage/**",
      "next-env.d.ts",
      "tsconfig.tsbuildinfo",
    ],
  },
  ...nextCoreWebVitals,
]

export default config
