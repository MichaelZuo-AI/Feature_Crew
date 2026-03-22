import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0050cb",
        "primary-container": "#0066ff",
        secondary: "#914c00",
        "secondary-container": "#ff8a00",
        tertiary: "#a33200",
        "tertiary-container": "#cc4204",
        surface: "#f7f9fc",
        "surface-dim": "#d8dadd",
        "surface-bright": "#f7f9fc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f7",
        "surface-container": "#eceef1",
        "surface-container-high": "#e6e8eb",
        "surface-container-highest": "#e0e3e6",
        "on-surface": "#191c1e",
        "on-surface-variant": "#424656",
        "on-primary": "#ffffff",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#613100",
        "on-tertiary": "#ffffff",
        outline: "#727687",
        "outline-variant": "#c2c6d8",
        error: "#ba1a1a",
        "error-container": "#ffdad6",
        "on-error": "#ffffff",
        "inverse-surface": "#2d3133",
        "inverse-on-surface": "#eff1f4",
        "inverse-primary": "#b3c5ff",
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1.5rem",
      },
      boxShadow: {
        ambient: "0 8px 24px rgba(0, 80, 203, 0.08)",
        "ambient-up": "0 -4px 12px rgba(0, 80, 203, 0.08)",
      },
      keyframes: {
        "scale-in": {
          "0%": { transform: "scale(0)" },
          "70%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "slide-up": {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
      },
      animation: {
        "scale-in": "scale-in 0.4s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-out": "fade-out 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};
export default config;
