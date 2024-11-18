import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/sections/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    fontFamily: {
      Montserrat: ["Montserrat"],
      CherryBomb: ["Cherry Bomb"],
      SquaredPixel: ["Pixel"]
    },
    backgroundImage: {
      vault: "linear-gradient(245deg, #F18E4E 12.36%, #D5B8DB 63.87%)"
    },
    extend: {
      boxShadow: {
        shadow1: "10px 10px 0 0 rgba(0, 0, 0, 0.25);"
      }
    },
    screens: {
      md: { max: "768px" },
      lg: { min: "769px" }
    }
  },
  plugins: []
};
export default config;
