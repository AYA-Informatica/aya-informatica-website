import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.5rem", sm: "2rem", lg: "3rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      // ── Brand Color System ──────────────────────────────────
      colors: {
        navy: {
          DEFAULT: "#001529",
          80: "rgba(0,21,41,0.8)",
          60: "rgba(0,21,41,0.6)",
          10: "rgba(0,21,41,0.08)",
        },
        accent: {
          DEFAULT: "#0A84FF",
          hover: "#0066CC",
          light: "rgba(10,132,255,0.12)",
        },
        brand: {
          bg: "#F5F5F5",
          dark: "#1A1A1A",
          gray: "#A0A0A0",
          "gray-light": "#E8E8E8",
          "gray-mid": "#D0D0D0",
        },
      },
      // ── Typography ─────────────────────────────────────────
      fontFamily: {
        display: ["Syne", "system-ui", "sans-serif"],
        body: ["DM Sans", "system-ui", "sans-serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      // ── Animations ─────────────────────────────────────────
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        pulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.8)" },
        },
        "scroll-line": {
          "0%": { transform: "scaleY(0)", transformOrigin: "top" },
          "50%": { transform: "scaleY(1)", transformOrigin: "top" },
          "51%": { transform: "scaleY(1)", transformOrigin: "bottom" },
          "100%": { transform: "scaleY(0)", transformOrigin: "bottom" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.6s cubic-bezier(0.25,0.46,0.45,0.94) both",
        "fade-in": "fade-in 0.5s ease both",
        "pulse-dot": "pulse 2s ease-in-out infinite",
        "scroll-line": "scroll-line 2s ease-in-out infinite",
      },
      // ── Spacing / Border Radius ─────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },
      // ── Box Shadows ─────────────────────────────────────────
      boxShadow: {
        card: "0 1px 3px rgba(0,21,41,0.06), 0 4px 16px rgba(0,21,41,0.06)",
        "card-hover": "0 8px 32px rgba(0,21,41,0.12)",
        accent: "0 8px 24px rgba(10,132,255,0.35)",
      },
    },
  },
  // Safelist custom breakpoints used in components
  safelist: [
    "min-[480px]:grid-cols-2",
    "min-[480px]:flex-row",
    "min-[480px]:items-center",
    "min-[480px]:w-auto",
  ],
  plugins: [require("tailwindcss-animate")],
}

export default config
