import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7FAF7",
        ink: "#16302A",
        sage: { 50: "#F1F8F2", 100: "#DDEEDF", 200: "#C4E0C8", 400: "#65A978", 500: "#438E5A", 600: "#337445", 700: "#285C37" },
      },
      boxShadow: {
        float: "0 18px 45px rgba(32, 78, 47, 0.10)",
        soft: "0 8px 24px rgba(32, 78, 47, 0.08)",
      },
    },
  },
  plugins: [],
} satisfies Config;
