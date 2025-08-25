"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useState } from "react";

const PointsEntry = (props: any) => {
  const { className } = props;

  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      className={clsx("relative h-[34px] rounded-[16px] bg-[#4B371F] pb-[4px] shrink-0", className)}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div
        className="w-[22px] h-[28px] absolute top-0 left-[10px] bg-[url('/images/check-in/gem.png')] bg-no-repeat bg-center bg-contain shrink-0"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img
            src="/images/check-in/star-white.png"
            alt=""
            className="w-[10px] h-[10px] object-center object-contain shrink-0 absolute left-[-5px] top-[5px]"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{
              duration: 0.3,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
              repeatDelay: 0.2,
            }}
          />
          <motion.img
            src="/images/check-in/star-white.png"
            alt=""
            className="w-[8px] h-[8px] object-center object-contain shrink-0 absolute right-[-4px] bottom-[5px]"
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{
              duration: 0.3,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse",
              repeatDelay: 0.2,
              delay: 0.1,
            }}
          />
        </motion.div>
      </motion.div>
      <div className="w-full h-full pl-[40px] pr-[14px] font-CherryBomb text-[16px] font-[400] leading-[22px] text-white [letter-spacing:0.8px] [text-shadow:0_2px_0_#4B371F] border-[2px] border-[#855B5B] bg-[#FFBABB] rounded-[16px]">
        500
      </div>
    </motion.button>
  );
};

export default PointsEntry;
