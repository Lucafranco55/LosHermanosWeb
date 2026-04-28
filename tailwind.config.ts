import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f4fbff",
          100: "#e7f6ff",
          200: "#c8eaff",
          300: "#8fd6ff",
          400: "#4dbbff",
          500: "#159be5",
          600: "#0d7cbc",
          700: "#0e6294",
          800: "#125377",
          900: "#143f58"
        }
      },
      boxShadow: {
        card: "0 18px 60px rgba(13, 56, 89, 0.12)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(to right, rgba(13,124,188,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(13,124,188,0.08) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
