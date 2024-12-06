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
      vault: "linear-gradient(245deg, #F18E4E 12.36%, #D5B8DB 63.87%)",
      christmas: "linear-gradient(180deg, #000 0%, #455972 30%)",
      snow: "radial-gradient(3px 3px at 100px 50px, #fff, transparent), radial-gradient(4px 4px at 200px 150px, #fff, transparent), radial-gradient(5px 5px at 300px 80px, #fff, transparent), radial-gradient(6px 6px at 400px 130px, #fff, transparent), radial-gradient(3px 3px at 540px 480px, #fff, transparent), radial-gradient(4px 4px at 50px 230px, #fff, transparent), radial-gradient(5px 5px at 120px 680px, #fff, transparent), radial-gradient(6px 6px at 223px 430px, #fff, transparent), radial-gradient(3px 3px at 700px 300px, #fff, transparent), radial-gradient(4px 4px at 760px 550px, #fff, transparent), radial-gradient(5px 5px at 550px 280px, #fff, transparent), radial-gradient(6px 6px at 650px 630px, #fff, transparent)"
    },
    extend: {
      boxShadow: {
        shadow1: "10px 10px 0 0 rgba(0, 0, 0, 0.25);",
        shadow2: "6px 6px 0px 0px rgba(0, 0, 0, 0.25)"
      }
    },
    screens: {
      md: { max: "768px" },
      lg: { min: "769px" }
    },
    animation: {
      "snow-down": "snowDown 10s linear infinite",
      "slide-to-left": "slide2Left 10s linear infinite",
      rotate: "rotate 2s linear infinite",
      shake: "shake 0.7s linear infinite",
      blink: "blink 4s ease-in-out infinite",
      "float-y": "floatY 4s ease-in-out infinite"
    },
    keyframes: {
      snowDown: {
        "0%": {
          transform: "translateY(0)"
        },
        "100%": {
          transform: "translateY(800px)"
        }
      },
      slide2Left: {
        "0%": {
          transform: "translateX(0)"
        },
        "100%": {
          transform: "translateX(-33.3333%)"
        }
      },
      rotate: {
        "0%": {
          transform: "rotate(0)"
        },
        "100%": {
          transform: "rotate(360deg)"
        }
      },
      shake: {
        "0%": {
          transform: "translateX(0) rotate(0deg)"
        },
        "25%": {
          transform: "translateX(-5px) rotate(-5deg)"
        },
        "50%": {
          transform: "translateX(5px) rotate(5deg)"
        },
        "75%": {
          transform: "translateX(-5px) rotate(-5deg)"
        },
        "100%": {
          transform: "translateX(0) rotate(0deg)"
        }
      },
      blink: {
        "0%": {
          opacity: "1",
          transform: "scale(1)"
        },
        "12%": {
          opacity: "1",
          transform: "scale(0.95)"
        },
        "25%": {
          opacity: "1",
          transform: "scale(1)"
        },
        "50%": {
          opacity: "0",
          transform: "scale(0.95)"
        },
        "75%": {
          opacity: "1",
          transform: "scale(0.98)"
        },
        "100%": {
          opacity: "1",
          transform: "scale(1)"
        }
      },
      floatY: {
        "0%": {
          transform: "translateY(0)"
        },
        "50%": {
          transform: "translateY(10px)"
        },
        "100%": {
          transform: "translateY(0)"
        }
      }
    }
  },
  plugins: []
};
export default config;
