import { CheckInDays } from "@/components/check-in/index";
import { useRef, useState } from "react";
import { Reward, RewardType } from "@/components/check-in/config";
import useCustomAccount from "@/hooks/use-account";
import { useRequest } from "ahooks";
import { cloneDeep } from "lodash";
import { get, post } from "@/utils/http";
import { numberFormatter } from "@/utils/number-formatter";
import { useUserStore } from "@/stores/user";
import Big from "big.js";

export const useCheckIn = () => {
  const { accountWithAk } = useCustomAccount();
  const checkInRef = useRef<any>();
  const userInfo = useUserStore((store: any) => store.user);
  const setUserInfo = useUserStore((store: any) => store.set);

  const [openReward, setOpenReward] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<Reward[]>();

  const { data: checkInData, loading: checkInDataLoading, runAsync: getCheckInData } = useRequest(async () => {
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
      // TODO
      // _rewardData.push({

      // });
    }
    if (reward_gem_amount) {
      _rewardData.push({
        type: RewardType.Gem,
        amount: reward_gem_amount,
        label: `${numberFormatter(reward_gem_amount, 0, true, { isShort: true, isShortUppercase: true })} Points`,
      });
      setUserInfo({
        user: {
          ...userInfo,
          gem: Big(userInfo.gem || 0).plus(reward_gem_amount).toNumber()
        }
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

  return {
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
  };
};
