"use client";

import { useUserStore } from "@/stores/user";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTimeLeft } from "./useTimeLeft";

const PointsEntry = (props: any) => {
  const { className, isGuide = false } = props;

  const userInfo = useUserStore((store: any) => store.user);

  const [isHovered, setIsHovered] = useState(isGuide);
  const timeLeft = useTimeLeft();

  return (
    <motion.button
      type="button"
      id="lootboxSeasonGemsEntry"
      className={clsx(
        "relative rounded-[16px] bg-[#4B371F] pb-[4px] shrink-0",
        isGuide ? "!cursor-default h-[38px] border-[2px] border-white" : "cursor-pointer h-[34px]",
        className
      )}
      onHoverStart={() => {
        if (isGuide) return;
        setIsHovered(true);
      }}
      onHoverEnd={() => {
        if (isGuide) return;
        setIsHovered(false);
      }}
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
        {numberFormatter(userInfo?.gem, 2, true, { isShort: true, isShortUppercase: true })}
      </div>

      <AnimatePresence>
        {isHovered && !isGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute bottom-[-180px] left-1/2 -translate-x-1/2 text-black"
          >
            <div className="shadow-[6px_6px_0_0_#00000040] gradient-border-box-10 rounded-[10px]">
              <div className="w-[222px] rounded-[10px] bg-[#FFF1C7]  px-[18px] py-[16px] flex flex-col items-center relative">
                <div className="text-[14px] font-Montserrat font-[500] text-center leading-[1.2] mb-[6px]">
                  First Round<br />
                  <span className="font-[600]">{`‘Incentivize Everything’`}</span>
                </div>
                <div className="w-full flex flex-col items-center text-[16px]">
                  <div className="w-full bg-[#FDD54C] rounded-full h-[40px] flex items-center justify-center mb-[8px]">
                    {timeLeft.days < 10 ? `0${timeLeft.days}` : timeLeft.days} days {timeLeft.hours < 10 ? `0${timeLeft.hours}` : timeLeft.hours} : {timeLeft.minutes < 10 ? `0${timeLeft.minutes}` : timeLeft.minutes}
                  </div>
                  <div className="text-[16px] font-Montserrat font-[500] text-center mb-[6px]">
                    Target Amount: <span className="font-[700] text-[16px]">500</span>
                  </div>
                  <div className="w-full flex items-center justify-center mt-[2px]">
                    <div className="w-[90%] h-[20px] bg-[#00000033] rounded-full flex items-center p-[5px]">
                      <div className="h-full bg-[#FDD54C] rounded-full transition-all duration-300" style={{ width: Math.min((userInfo?.gem || 0) / 500 * 100, 100) + '%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default PointsEntry;
