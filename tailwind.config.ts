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
        "2xl": "1280px",
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
        // Couleurs de marque FC Littoral
        gold: {
          DEFAULT: "#F5C518",
          50: "#FEF9E6",
          100: "#FDF0BF",
          200: "#FBE187",
          300: "#F9D24F",
          400: "#F5C518",
          500: "#E0B000",
          600: "#B88E00",
          700: "#8F6E00",
        },
        forest: {
          DEFAULT: "#1F7A3D",
          50: "#E8F5ED",
          100: "#C6E6D1",
          200: "#8FCBA4",
          300: "#52AE74",
          400: "#2E8F51",
          500: "#1F7A3D",
          600: "#176030",
          700: "#0F4521",
        },
        ink: "#0B0B0B",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
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
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
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
        "fade-up": "fade-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.8s ease-out forwards",
      },
      backgroundImage: {
        "gold-grain":
          "radial-gradient(circle at 20% 20%, rgba(245,197,24,0.18), transparent 40%), radial-gradient(circle at 80% 0%, rgba(31,122,61,0.18), transparent 45%)",
      },
      boxShadow: {
        sm: "0 1px 2px 0 rgba(11,11,11,0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(11,11,11,0.08), 0 1px 2px -1px rgba(11,11,11,0.06)",
        md: "0 6px 16px -4px rgba(11,11,11,0.10), 0 2px 6px -2px rgba(11,11,11,0.06)",
        lg: "0 14px 32px -8px rgba(11,11,11,0.14), 0 6px 14px -8px rgba(11,11,11,0.08)",
        xl: "0 26px 50px -14px rgba(11,11,11,0.18)",
        "2xl": "0 36px 70px -18px rgba(11,11,11,0.22)",
        gold: "0 10px 34px -8px rgba(245,197,24,0.40)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
