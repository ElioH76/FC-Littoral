import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1240px",
      },
    },
    extend: {
      colors: {
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
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // ── Marque FC Littoral — refonte sombre cinématographique ──
        ink: {
          DEFAULT: "#070A07", // fond principal
          800: "#0C120C", // surface (ink-2)
          700: "#0B1E12", // field (vert très sombre)
        },
        bone: {
          DEFAULT: "#F4F2EA", // texte clair principal
          dim: "#B9BBB3", // texte clair atténué
        },
        paper: {
          DEFAULT: "#F4F1E9", // sections claires
          card: "#FFFFFF",
        },
        gold: {
          DEFAULT: "#C9A227",
          bright: "#EAC451",
          50: "#FBF7E9",
          100: "#F3E8C4",
          200: "#E7D08A",
          300: "#D9B856",
          400: "#C9A227",
          500: "#A9871C",
          600: "#876A14",
          700: "#5F4B0E",
        },
        forest: {
          DEFAULT: "#16923F",
          bright: "#2BD06B",
          50: "#E7F7EC",
          100: "#C2EBCF",
          200: "#84D6A1",
          300: "#43BD72",
          400: "#1FA050",
          500: "#16923F",
          600: "#0F6E2F",
          700: "#0A4D21",
        },
        violet: {
          DEFAULT: "#7E3FF2",
          bright: "#9D6BF7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"], // Anton
        heading: ["var(--font-heading)", "system-ui", "sans-serif"], // Archivo
        sans: ["var(--font-sans)", "system-ui", "sans-serif"], // Manrope
        script: ["var(--font-script)", "cursive"], // Caveat
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.7s cubic-bezier(.22,.61,.36,1) forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
      backgroundImage: {
        "kit-stripe":
          "linear-gradient(100deg,#C9A227 0 33.3%,#16923F 33.3% 66.6%,#7E3FF2 66.6% 100%)",
        "gold-grain":
          "radial-gradient(circle at 20% 20%, rgba(201,162,39,0.16), transparent 42%), radial-gradient(circle at 80% 0%, rgba(22,146,63,0.18), transparent 46%)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(0,0,0,0.30)",
        DEFAULT: "0 2px 8px -2px rgba(0,0,0,0.45)",
        md: "0 10px 24px -8px rgba(0,0,0,0.55)",
        lg: "0 24px 60px -18px rgba(0,0,0,0.65)",
        xl: "0 34px 70px -22px rgba(0,0,0,0.7)",
        gold: "0 14px 40px -10px rgba(201,162,39,0.45)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
