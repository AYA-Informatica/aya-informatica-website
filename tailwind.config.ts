import type { Config } from "tailwindcss"

const config: Config = {
  // Class-based rather than the default "media", so a visitor can override
  // their OS setting. The class is set before first paint by the theme script.
  darkMode: "class",
  content: [
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
      // ── Semantic tokens (theme-aware) ───────────────────────
      // Backed by CSS variables declared in globals.css, so the same utility
      // resolves differently per theme. The `<alpha-value>` placeholder is what
      // keeps opacity modifiers (`bg-surface/50`) working.
      colors: {
        surface: {
          DEFAULT: "rgb(var(--surface) / <alpha-value>)",
          raised: "rgb(var(--surface-raised) / <alpha-value>)",
          inverse: "rgb(var(--surface-inverse) / <alpha-value>)",
        },
        content: {
          DEFAULT: "rgb(var(--content) / <alpha-value>)",
          strong: "rgb(var(--content-strong) / <alpha-value>)",
          muted: "rgb(var(--content-muted) / <alpha-value>)",
          "on-inverse": "rgb(var(--content-on-inverse) / <alpha-value>)",
        },
        "border-subtle": "rgb(var(--border-subtle) / <alpha-value>)",
        // `ring-offset-background` is used by the form controls and the button.
        // Tailwind never generated it because no `background` colour existed,
        // so the focus ring had no offset colour and fell back to white — a
        // white halo on any dark surface.
        background: "rgb(var(--surface) / <alpha-value>)",

        // ── Existing literal brand palette ────────────────────
        // Kept unchanged so the site builds and looks identical while the
        // migration onto the tokens above happens page by page.
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
        display: ["'Syne Variable'", "Syne", "system-ui", "sans-serif"],
        body: ["'DM Sans Variable'", "DM Sans", "system-ui", "sans-serif"],
        sans: ["'DM Sans Variable'", "DM Sans", "system-ui", "sans-serif"],
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
      // ── Opacity scale ───────────────────────────────────────
      // Tailwind ships 0,5,10,15,20,…  Anything off that scale silently
      // produces no rule at all: `bg-navy/8` compiled to nothing, so the icon
      // containers using it have had no background. globals.css previously
      // hand-wrote a few of these (/7, /8, /12, /97) to paper over it; the rest
      // were simply dead. Declaring them here fixes both.
      opacity: {
        2: "0.02",
        3: "0.03",
        4: "0.04",
        6: "0.06",
        7: "0.07",
        8: "0.08",
        12: "0.12",
        97: "0.97",
      },
      // ── Spacing / Border Radius ─────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },
      // ── Box Shadows ─────────────────────────────────────────
      boxShadow: {
        // Colour and strength come from tokens so the shadow re-tints per
        // theme: navy and subtle on light, black and stronger on dark where a
        // tinted shadow would vanish.
        card: "0 1px 3px rgb(var(--shadow-rgb) / var(--shadow-strength)), 0 4px 16px rgb(var(--shadow-rgb) / var(--shadow-strength))",
        "card-hover": "0 8px 32px rgb(var(--shadow-rgb) / calc(var(--shadow-strength) * 2))",
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
