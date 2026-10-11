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
        emergency: {
          bg: "#0a0a0a",
          text: "#ffffff",
          accent: "#ff0000",
        },
      },
    },
  },
  plugins: [],
};

export default config;
