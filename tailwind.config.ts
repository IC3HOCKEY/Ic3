import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#050b14",
          50: "#f2f6fb",
          900: "#0a1c2c",
          950: "#050b14",
        },
        steel: {
          DEFAULT: "#1f2839",
          900: "#1f2839",
          800: "#253042",
        },
        ice: {
          DEFAULT: "#99dffb",
          50: "#eafaff",
          200: "#c3ecfd",
          400: "#99dffb",
          500: "#7bc6ea",
          700: "#4b9bc7",
        },
        ember: "#ff6b4a",
      },
      fontFamily: {
        display: ["var(--font-display)", "Bebas Neue", "Impact", "sans-serif"],
        body: ["var(--font-body)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        ic3: ["var(--font-ic3)", "sans-serif"],
      },
      letterSpacing: {
        hero: "0.08em",
      },
      boxShadow: {
        ice: "0 0 40px rgba(153, 223, 251, 0.35)",
        glass: "0 10px 40px rgba(5, 11, 20, 0.45)",
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "ice-gradient":
          "linear-gradient(135deg, #050b14 0%, #0a1c2c 45%, #1f2839 100%)",
        "ice-glow":
          "radial-gradient(circle at 50% 40%, rgba(153,223,251,0.35) 0%, rgba(5,11,20,0) 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
