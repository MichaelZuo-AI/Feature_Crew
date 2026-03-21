import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#6366F1",
        "accent-light": "#818CF8",
        surface: "#1A1A1A",
        "surface-2": "#242424",
        border: "#333333",
        "chip-bg": "#2D2B55",
        "chip-text": "#A5B4FC",
        success: "#22C55E",
        badge: "#EF4444",
        stars: "#F59E0B",
        text: "#E8E8E8",
        "text-muted": "#888888",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        pill: "20px",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
