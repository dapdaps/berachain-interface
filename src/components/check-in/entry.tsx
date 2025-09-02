"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Popover, { PopoverPlacement, PopoverTrigger } from "../popover";
import CheckIn from ".";
import CheckInRewardView from "./reward";
import { useCheckIn } from "@/hooks/use-check-in";

const CheckInEntry = (props: any) => {
  const { className } = props;

  const {
    checkInRef,
    openReward,
    rewardData,
    checkInData,
    checkInDataLoading,
    getCheckInData,
    onCheckIn,
    checkInPending,
    setOpenReward,
    setRewardData,
  } = useCheckIn();

  return (
    <>
      <Popover
        ref={checkInRef}
        content={(
          <CheckIn
            setOpenReward={setOpenReward}
            setRewardData={setRewardData}
            data={checkInData}
            loading={checkInDataLoading}
            getData={getCheckInData}
            onCheckIn={onCheckIn}
            checkInPending={checkInPending}
          />
        )}
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.Bottom}
      >
        <motion.button
          type="button"
          id="lootboxSeasonCheckInEntry"
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
      <CheckInRewardView
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
