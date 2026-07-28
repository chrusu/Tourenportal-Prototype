import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        // shadcn/ui tokens (mapped to SAC palette via CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Official SAC styleguide colors (see styleguide.md)
        sac: {
          red: "#E30613",
          "red-hover": "#B00511",
          "red-30": "#F6B4B8",
          green: "#84BE41",
          "green-hover": "#81A624",
          yellow: "#FFCC00",
          orange: "#FF8800",
          black: "#333333",
          "gray-dark": "#706F6F",
          gray: "#E9E9E9",
          "gray-medium": "#999999",
          "gray-light": "#F4F4F4",
          snow: "#F9F9F9",
          "alert-blue": "#00A3DA",
          "alert-yellow": "#FFD300",
        },
        // SAC discipline colors
        discipline: {
          "mountain-hiking": "#237100",
          "alpine-tour": "#662D91",
          climbing: "#FF3D12",
          "via-ferrata": "#FF8800",
          "ski-tour": "#0033FF",
          "snowshoe-tour": "#008A79",
        },
      },
      fontFamily: {
        sans: [
          "Frutiger",
          "Frutiger LT Std",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      fontSize: {
        // SAC typography scale (fs-* styleguide)
        "sac-h1": ["36px", { lineHeight: "1.25", fontWeight: "700" }],
        "sac-h1-subline": ["36px", { lineHeight: "1.25", fontWeight: "300" }],
        "sac-h2": ["30px", { lineHeight: "1.25", fontWeight: "700" }],
        "sac-h2-subline": ["30px", { lineHeight: "1.25", fontWeight: "300" }],
        "sac-h3": ["22px", { lineHeight: "1.25", fontWeight: "700" }],
        "sac-h3-subline": ["22px", { lineHeight: "1.25", fontWeight: "300" }],
        "sac-h4": ["15px", { lineHeight: "1.25", fontWeight: "700" }],
        "sac-copy": ["15px", { lineHeight: "1.5", fontWeight: "300" }],
        "sac-copy-bold": ["15px", { lineHeight: "1.5", fontWeight: "700" }],
        "sac-copy-note": ["12px", { lineHeight: "1.5", fontWeight: "300" }],
        "sac-copy-note-bold": ["12px", { lineHeight: "1.5", fontWeight: "700" }],
        "sac-label": ["10px", { lineHeight: "1", fontWeight: "300" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [animate],
} satisfies Config;
