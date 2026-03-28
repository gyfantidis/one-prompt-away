import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#0D1117",
          surface: "#161B22",
          card: "#21262D",
          border: "#30363D",
          teal: "#2DD4BF",
          "teal-dark": "#14B8A6",
          "teal-light": "#5EEAD4",
          amber: "#F59E0B",
          "amber-dark": "#D97706",
          "amber-light": "#FCD34D",
          text: "#E6EDF3",
          muted: "#8B949E",
        },
      },
      fontFamily: {
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "SF Mono",
          "monospace",
        ],
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#E6EDF3",
            "--tw-prose-headings": "#E6EDF3",
            "--tw-prose-links": "#2DD4BF",
            "--tw-prose-bold": "#E6EDF3",
            "--tw-prose-code": "#2DD4BF",
            "--tw-prose-pre-bg": "#161B22",
            "--tw-prose-pre-code": "#E6EDF3",
            color: "#E6EDF3",
            a: {
              color: "#2DD4BF",
              textDecoration: "none",
              "&:hover": {
                color: "#5EEAD4",
              },
            },
            code: {
              color: "#2DD4BF",
              backgroundColor: "#161B22",
              padding: "0.15em 0.4em",
              borderRadius: "0.25rem",
              fontWeight: "400",
            },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            pre: {
              backgroundColor: "#161B22",
              border: "1px solid #30363D",
              borderRadius: "0.5rem",
            },
            h1: {
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontWeight: "700",
            },
            h2: {
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontWeight: "700",
            },
            h3: {
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontWeight: "600",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
