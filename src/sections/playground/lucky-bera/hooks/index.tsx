import { useDebounceFn, useRequest } from 'ahooks';
import { get, post } from '@/utils/http';
import { useEffect, useState } from 'react';
import { SpinMultiplier, SpinResultData, SpinUserData } from '../config';
import useToast from '@/hooks/use-toast';
import { useLuckyBeraStore } from '../store';
import useCustomAccount from '@/hooks/use-account';
import axios from 'axios';

const tgUserId = 7150006688;
const getUserInfo = () => {};

export function useLuckyBera() {
  const { accountWithAk } = useCustomAccount();
  const toast = useToast();
  const { setLastSpinResult, lastSpinResult } = useLuckyBeraStore();
 
  const multipliers = Object.values(SpinMultiplier).filter(multiplier => typeof multiplier === "number");

  const [spinMultiplier, setSpinMultiplier] = useState<SpinMultiplier>(SpinMultiplier.X1);

  const { run: getSpinUserData, data: spinUserData, loading: spinUserDataLoading } = useRequest<SpinUserData, any>(async () => {
    const url = new URL("https://dev-api-game.beratown.app/api/spin/user");
    url.searchParams.set("tg_user_id", tgUserId.toString());
    const res = await axios.get(url.toString());
    if (res.data.code !== 200) {
      checkSpinMultiplier();
      return {};
    }
    checkSpinMultiplier(res.data.data);
    return res.data.data;
  }, {
    manual: true,
  });

  const { run: reloadSpinData } = useDebounceFn((lastSpinResult: any) => {
    getUserInfo();
    getSpinUserData();
    setLastSpinResult(lastSpinResult);
  }, { wait: 5000 });

  const { runAsync: handleSpinResult, data: spinResultData, loading: spinResultDataLoading } = useRequest<SpinResultData | boolean, any>(async () => {
    if (!accountWithAk) return;
    try {
      const res = await post("https://dev-api-game.beratown.app/api/spin", {
        spin: spinMultiplier,
      });
      if (res.code !== 200) {
        toast.fail({ title: `Spin failed: ${res.message || res.data}` });
        return false;
      }
      reloadSpinData(res.data);
      return res.data;
    } catch (error: any) {
      toast.fail({ title: `Spin failed: ${error.message}` });
      return false;
    }
  }, {
    manual: true,
  });

  const toggleSpinMultiplier = () => {
    if (!spinUserData?.spin) return;
    let currIndex = multipliers.indexOf(spinMultiplier);
    let nextIndex = currIndex + 1;
    if (nextIndex >= multipliers.length - 1) nextIndex = 0;
    if (multipliers[nextIndex] > spinUserData.spin) {
      nextIndex = 0;
    }
    setSpinMultiplier(multipliers[nextIndex]);
  };

  const checkSpinMultiplier = (_spinUserData?: SpinUserData) => {
    if (!_spinUserData?.spin) {
      setSpinMultiplier(SpinMultiplier.X1);
      return;
    }
    let currIndex = multipliers.indexOf(spinMultiplier);
    if (multipliers[currIndex] > _spinUserData.spin) {
      setSpinMultiplier(SpinMultiplier.X1);
    }
  };

  useEffect(() => {
    if (!tgUserId) return;
    getSpinUserData();
  }, [tgUserId]);

  return {
    spinUserData,
    spinUserDataLoading,
    spinMultiplier,
    handleSpinResult,
    spinResultData,
    spinResultDataLoading,
    toggleSpinMultiplier,
    lastSpinResult,
  };
}
