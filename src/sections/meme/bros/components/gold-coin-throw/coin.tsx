import { motion } from "framer-motion";
import { useRef } from "react";

export default function Coin({ x, y, rotate, duration, i }: any) {
  const eleRef = useRef<any>();
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 55 56"
      fill="none"
      ref={eleRef}
      initial={{
        opacity: 0,
        scale: 0.5,
        y: 0,
        x: 0,
        rotate: 0
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y,
        x,
        rotate,
        transition: {
          type: "tween",
          ease: "circOut",
          duration: 0.1
        }
      }}
      className="absolute duration-300 w-[55px] h-[56px] md:w-[25px] md:h-[24px]"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.2587 19.1068L20.1631 6.8784L22.4559 9.29797L9.55152 21.5263L7.2587 19.1068ZM32.4794 45.7221L45.3838 33.4937L47.6766 35.9133L34.7722 48.1416L32.4794 45.7221ZM30.1862 43.3019L27.7668 45.5946L25.4747 43.1758L23.0552 45.4686L25.348 47.8882L27.7674 45.5955L30.0595 48.0143L32.479 45.7215L30.1862 43.3019ZM45.5113 28.7816L43.0917 31.0744L45.3846 33.494L47.8041 31.2012L45.5113 28.7816ZM9.55085 21.5259L7.13128 23.8187L9.4241 26.2383L11.8437 23.9455L9.55085 21.5259ZM24.876 7.00559L22.4564 9.29841L24.7492 11.718L27.1686 9.42532L29.4607 11.8441L31.8803 9.55129L29.5874 7.13172L27.168 9.42438L24.876 7.00559ZM9.42451 26.2381L7.00494 28.5309L9.29776 30.9505L11.7173 28.6577L9.42451 26.2381ZM45.6372 24.0686L43.2179 26.3612L45.5107 28.7808L47.9303 26.488L45.6379 24.0688L48.0572 21.7762L34.3003 7.25878L31.8807 9.5516L45.6372 24.0686ZM23.0553 45.4689L20.6357 47.7618L6.87883 33.2443L9.2984 30.9515L23.0553 45.4689Z"
        fill="black"
      />
      <rect
        x="25.475"
        y="43.1758"
        width="3.33337"
        height="20.0002"
        transform="rotate(136.541 25.475 43.1758)"
        fill="#FAAA01"
      />
      <rect
        width="24.4447"
        height="26.667"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 27.1681 9.4248)"
        fill="#FDD700"
      />
      <rect
        width="3.33337"
        height="20.0002"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 31.8809 9.55176)"
        fill="#FBEF00"
      />
      <rect
        width="3.33337"
        height="3.33337"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 27.1681 9.4248)"
        fill="#FBEF00"
      />
      <rect
        width="3.33337"
        height="3.33337"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 43.2184 26.3623)"
        fill="#FBEF00"
      />
      <rect
        width="3.33337"
        height="3.33337"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 24.7486 11.7178)"
        fill="white"
      />
      <rect
        width="3.33337"
        height="3.33337"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 29.4614 11.8447)"
        fill="white"
      />
      <rect
        width="17.778"
        height="3.33337"
        transform="matrix(-0.725864 0.687838 0.687838 0.725864 22.4567 9.29883)"
        fill="#FBEF00"
      />
      <rect
        x="14.1377"
        y="26.3662"
        width="3.33337"
        height="3.33337"
        transform="rotate(136.541 14.1377 26.3662)"
        fill="#FAAA01"
      />
      <rect
        x="30.1864"
        y="43.3018"
        width="3.33337"
        height="3.33337"
        transform="rotate(136.541 30.1864 43.3018)"
        fill="#FAAA01"
      />
      <rect
        x="45.384"
        y="33.4941"
        width="17.778"
        height="3.33337"
        transform="rotate(136.541 45.384 33.4941)"
        fill="#FAAA01"
      />
      <rect
        x="30.7198"
        y="39.2666"
        width="3.07696"
        height="16.9233"
        transform="rotate(136.541 30.7198 39.2666)"
        fill="black"
      />
      <rect
        x="32.9528"
        y="37.1504"
        width="3.07696"
        height="16.9233"
        transform="rotate(136.541 32.9528 37.1504)"
        fill="#FAAA01"
      />
      <rect
        x="36.3022"
        y="33.9746"
        width="7.6924"
        height="3.07696"
        transform="rotate(136.541 36.3022 33.9746)"
        fill="black"
      />
      <rect
        x="21.3119"
        y="24.8662"
        width="3.07696"
        height="3.07696"
        transform="rotate(136.541 21.3119 24.8662)"
        fill="black"
      />
    </motion.svg>
  );
}
