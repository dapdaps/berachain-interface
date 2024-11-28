import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    fontFamily: {
      Montserrat: ['Montserrat'],
      CherryBomb: ['Cherry Bomb']
    },
    backgroundImage: {
      vault: 'linear-gradient(245deg, #F18E4E 12.36%, #D5B8DB 63.87%)'
    },
    extend: {
      boxShadow: {
        shadow1: '10px 10px 0 0 rgba(0, 0, 0, 0.25);'
      },
      colors: {
        peach: "#FFF8F3",
        solitude: "#E5F0FF",
        lily: "#E5F7FF",
  
        focus: "#EFEFF0",
        primary: "#2A2A27",
        secondary: "#606055",
        tertiary: "#A6A69A",
        z0: "#FFFFFF",
        z2: "#F7F7F6",
        divider: "#E5E5E1",
        separator: "#E5E5E1",
        spring_wood: "#F1F3E7",
        trout: "#525766",
        success: "#3CC27A",
        warning: "#EC8814",
        error: "#EB3C27",
        placeholder: "rgba(96, 96, 85, 0.5)",
  
        _primary: "#011A16",
      },
    },
    screens: {
      md: { max: '768px' },
      lg: { min: '769px' }
    }
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
