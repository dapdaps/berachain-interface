import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontFamily: {
      Montserrat: ['Montserrat'],
      CherryBomb: ['Cherry Bomb'],
    },
    extend: {
      boxShadow: {
        shadow1: '10px 10px 0 0 rgba(0, 0, 0, 0.25);',
      },
    },
  },
  plugins: [],
};
export default config;