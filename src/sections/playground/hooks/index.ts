import { useState } from "react";
import { SpinMultiplier, SpinUserData } from "../lucky-bera/config";
import { useRequest } from "ahooks";
import { get } from "@/utils/http";
import useCustomAccount from "@/hooks/use-account";
import { WheelUserData } from "../big-wheel/config";
import { usePlaygroundStore } from "@/stores/use-playground";

export function usePlayground() {
  const multipliers = Object.values(SpinMultiplier).filter(multiplier => typeof multiplier === "number");

  const { accountWithAk } = useCustomAccount();
  const {
    spinUserData,
    setSpinUserData,
    wheelUserData,
    setWheelUserData,
  } = usePlaygroundStore();

  const [spinMultiplier, setSpinMultiplier] = useState<SpinMultiplier>(SpinMultiplier.X1);

  const checkSpinMultiplier = (_spinUserData?: SpinUserData) => {
    if (!_spinUserData?.spin_balance) {
      setSpinMultiplier(SpinMultiplier.X1);
      return;
    }
    let currIndex = multipliers.indexOf(spinMultiplier);
    if (multipliers[currIndex] > _spinUserData.spin_balance) {
      setSpinMultiplier(SpinMultiplier.X1);
    }
  };

  const { runAsync: getSpinUserData, loading: spinUserDataLoading } = useRequest<SpinUserData, any>(async () => {
    if (!accountWithAk) return;
    const res = await get("/api/go/game/777/user");
    if (res.code !== 200) {
      checkSpinMultiplier();
      setSpinUserData(void 0);
      return {};
    }
    checkSpinMultiplier(res.data);
    setSpinUserData(res.data);
    return res.data;
  }, {
    refreshDeps: [accountWithAk],
  });

  const { loading: wheelUserDataLoading, runAsync: getWheelUserData } = useRequest<WheelUserData, any>(async () => {
    if (!accountWithAk) {
      setWheelUserData(void 0);
      return;
    }
    const res = await get("/api/go/game/wheel/user");
    if (res.code !== 200) {
      setWheelUserData(void 0);
      return;
    }
    setWheelUserData(res.data);
    return res.data;
  }, {
    refreshDeps: [accountWithAk],
  });

  return {
    multipliers,
    spinMultiplier,
    setSpinMultiplier,
    spinUserData,
    setSpinUserData,
    getSpinUserData,
    spinUserDataLoading,
    wheelUserData,
    setWheelUserData,
    wheelUserDataLoading,
    getWheelUserData,
  };
}
