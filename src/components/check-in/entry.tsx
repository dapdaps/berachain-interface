"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import Popover, { PopoverPlacement, PopoverTrigger } from "../popover";
import CheckIn, { CheckInDays } from ".";
import { useRef, useState } from "react";
import CheckInRewardView from "./reward";
import { Reward, RewardType } from "./config";
import useCustomAccount from "@/hooks/use-account";
import { useRequest } from "ahooks";
import { cloneDeep } from "lodash";
import { get, post } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";

const CheckInEntry = (props: any) => {
  const { className } = props;

  const { accountWithAk } = useCustomAccount();
  const checkInRef = useRef<any>();

  const [openReward, setOpenReward] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<Reward[]>();

  const { data: checkInData, loading: checkInDataLoading, runAsync: getCheckInData } = useRequest(async (mockCheckDay?: number) => {
    if (!accountWithAk) {
      return;
    }
    const checkInDays = cloneDeep(CheckInDays);
    const res = await get("/api/go/checkin");
    if (res.code !== 200 || !res.data) {
      return;
    }
    const { consecutive_check_in = 0 } = res.data;
    if (consecutive_check_in > 0) {
      for (let i = 0; i < (consecutive_check_in % 7 === 0 ? 7 : consecutive_check_in % 7); i++) {
        checkInDays[i].checked = true;
      }
    }
    const _checkInData = {
      ...res.data,
      days: checkInDays,
    };
    return _checkInData;
  }, {
    refreshDeps: [accountWithAk]
  });

  const { runAsync: onCheckIn, loading: checkInPending } = useRequest(async () => {
    if (!accountWithAk) {
      return;
    }
    const res = await post("/api/go/checkin");
    if (res.code !== 200 || !res.data || res.data.success !== true) {
      return;
    }
    checkInRef.current?.onClose?.();
    // reload check in data
    getCheckInData();
    const { reward_box_amount, reward_gem_amount } = res.data;
    // popup reward
    const _rewardData: any = [];
    if (reward_box_amount) {
      // _rewardData.push({

      // });
    }
    if (reward_gem_amount) {
      _rewardData.push({
        type: RewardType.Gem,
        amount: reward_gem_amount,
        label: `${numberFormatter(reward_gem_amount, 0, true, { isShort: true, isShortUppercase: true })} Gem`,
      });
    }
    if (_rewardData.length > 0) {
      setRewardData(_rewardData);
      setOpenReward(true);
    }
    return res.data;
  }, {
    manual: true,
  });

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
