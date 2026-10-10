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
        primary: {
          DEFAULT: "#05893e",
          strong: "#047f39",
          content: "#f3fbf4",
          border: "#037333",
          link: "#02642b",
        },
        base: {
          100: "#fafcfa",
          200: "#f0f5f0",
          300: "#e1e8e1",
          content: "#1d271f",
        },
        muted: {
          DEFAULT: "#657568",
          subtle: "#88998b",
        },
        success: {
          DEFAULT: "#1a9951",
          bg: "#eaf8ef",
        },
        error: {
          DEFAULT: "#d03739",
          content: "#fff6f5",
          bg: "#fdeeed",
          border: "#b02d2f",
        },
      },
      fontFamily: {
        bengali: ["var(--font-hind-siliguri)", "sans-serif"],
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 35s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
