"use client";

import { useUserStore } from "@/stores/user";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTimeLeft } from "./useTimeLeft";
import Popover, { PopoverPlacement, PopoverTrigger } from "../popover";
import FirstRoundCountdown from "./first-round-countdown";

const PointsEntry = (props: any) => {
  const { className, isGuide = false } = props;

  const userInfo = useUserStore((store: any) => store.user);

  const [isHovered, setIsHovered] = useState(isGuide);
  const timeLeft = useTimeLeft();

  return (
    <Popover
      content={isGuide ? null : (
        <FirstRoundCountdown
          timeLeft={timeLeft}
          userInfo={userInfo}
          className=""
        />
      )}
      placement={PopoverPlacement.Bottom}
      trigger={PopoverTrigger.Hover}
    >
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
          {numberFormatter(userInfo?.gem, 2, true, { isShort: false, isShortUppercase: true })}
        </div>
      </motion.button>
    </Popover>
  );
};

export default PointsEntry;
