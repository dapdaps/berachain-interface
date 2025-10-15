import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { get, post } from "@/utils/http";
import { useRequest } from "ahooks";
import Big from "big.js";
import { useMemo, useState } from "react";
import { RewardType } from "../check-in/config";
import { numberFormatter } from "@/utils/number-formatter";
import { GameLootbox } from "@/configs/playground";

export function usePartner(props?: any) {
  const { show, tab } = props ?? {};

  const toast = useToast();
  const { accountWithAk, account } = useCustomAccount();

  const [userBoxes, setUserBoxes] = useState<Map<string, any>>(new Map());
  const [userBoxesTotal, userBoxesTotalBalance] = useMemo(() => {
    let _total = Big(0);
    let _totalBalance = Big(0);

    if (userBoxes?.size) {
      userBoxes.forEach((item: any) => {
        _total = _total.plus(item.box);
        _totalBalance = _totalBalance.plus(item.balance_box);
      });
    }

    return [_total, _totalBalance];
  }, [userBoxes]);

  const { runAsync: getUserBoxes, loading: userBoxesLoading } = useRequest(async () => {
    if (!show || tab !== "partners") {
      return;
    }
    if (!accountWithAk) {
      setUserBoxes(new Map());
      return;
    }
    try {
      const res = await get("/api/go/box/user");
      if (res.code !== 200) {
        setUserBoxes(new Map());
        return;
      }
      const _list = res.data || [];
      const _boxes = new Map();
      _list.forEach((item: any) => {
        if (!_boxes.has(item.category)) {
          _boxes.set(item.category, item);
        }
      });
      setUserBoxes(_boxes);
    } catch (error) {
      setUserBoxes(new Map());
      console.log("get partner boxes failed: %o", error);
    }
  }, {
    refreshDeps: [accountWithAk, show, tab],
  });

  const [openReward, setOpenReward] = useState(false);
  const [openRewardData, setOpenRewardData] = useState<any>(null);
  const [openRewardCategory, setOpenRewardCategory] = useState<any>(null);
  const { runAsync: openBox, loading: opening } = useRequest(async (params: { category: string; box?: number; }) => {
    let toastId = toast.loading({
      title: "Opening...",
    });
    try {
      const res = await post("/api/go/box/draw", {
        ...params,
        box: params.box || 1,
      });
      toast.dismiss(toastId);
      if (res.code !== 200) {
        toast.fail({
          title: "Opening failed!",
          text: res.message,
        });
        return;
      }
      // success
      const currentBox = GameLootbox[params.category];
      setOpenRewardCategory(currentBox);
      const _rewardData: any = [];
      if (res.data.cosmetic && res.data.cosmetic.length > 0) {
        _rewardData.push({
          type: RewardType.Cosmetic,
          amount: res.data.cosmetic.length,
          label: `${numberFormatter(res.data.cosmetic.length, 0, true)} Cosmetic${res.data.cosmetic.length > 1 ? 's' : ''}`,
        });
      }
      if (res.data.gem_amount && res.data.gem_amount > 0) {
        _rewardData.push({
          type: RewardType.Gem,
          amount: res.data.gem_amount,
          label: `${numberFormatter(res.data.gem_amount, 0, true)} Point${res.data.box_balance > 1 ? 's' : ''}`,
        });
      }
      if (res.data.reward_amount && res.data.reward_amount > 0) {
        _rewardData.push({
          type: RewardType.NFT,
          amount: res.data.reward_amount,
          img: currentBox?.img,
          label: `${numberFormatter(res.data.reward_amount, 0, true)} ${currentBox?.name}`,
        });
      }
      setOpenRewardData(_rewardData);
      setOpenReward(true);
      setUserBoxes((prev) => {
        const _userBox = new Map(prev);
        _userBox.get(params.category).balance_box = Big(_userBox.get(params.category).balance_box || 0).minus(params.box || 1).toNumber();
        _userBox.get(params.category).used_box = Big(_userBox.get(params.category).used_box || 0).plus(params.box || 1).toNumber();
        return _userBox;
      });
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.fail({
        title: "Opening failed!",
        text: error.message,
      });
    }
  }, {
    manual: true,
  });

  const onCloseReward = () => {
    setOpenReward(false);
    setOpenRewardData(null);
  };

  return {
    userBoxes,
    getUserBoxes,
    userBoxesLoading,
    userBoxesTotal,
    userBoxesTotalBalance,
    openBox,
    opening,
    openReward,
    openRewardData,
    onCloseReward,
    openRewardCategory,
  };
}
