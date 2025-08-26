"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Popover, { PopoverPlacement, PopoverTrigger } from "../popover";
import CheckIn from ".";
import { useState } from "react";
import CheckInReward from "./reward";
import { Reward } from "./config";

const CheckInEntry = (props: any) => {
  const { className } = props;

  const [openReward, setOpenReward] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<Reward[]>();

  return (
    <>
      <Popover
        content={(
          <CheckIn
            setOpenReward={setOpenReward}
            setRewardData={setRewardData}
          />
        )}
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.Bottom}
      >
        <motion.button
          type="button"
          className={clsx("w-[45px] h-[42px] shrink-0 bg-[url('/images/check-in/entry.png')] bg-no-repeat bg-center bg-contain", className)}
          initial={{
            rotate: 0,
            scale: 1,
          }}
          whileHover={{
            rotate: [0, -5, 5, -3, 3, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
        />
      </Popover>
      <CheckInReward
        open={openReward}
        onClose={() => {
          setOpenReward(false);
          setRewardData(void 0);
        }}
        data={rewardData}
      />
    </>
  );
};

export default CheckInEntry;
