import { useDebounceFn, useRequest } from 'ahooks';
import { get, post } from '@/utils/http';
import { useEffect, useState } from 'react';
import { BUY_SPINS_CONTRACT_ADDRESS, BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS, SPIN_CATEGORIES, SpinMultiplier, SpinResultData, SpinUserData, SpinCategory } from '../config';
import useToast from '@/hooks/use-toast';
import { useLuckyBeraStore } from '../store';
import useCustomAccount from '@/hooks/use-account';
import { ethers } from 'ethers';
import Big from 'big.js';
import { bera } from '@/configs/tokens/bera';
import { useConnectModal } from '@rainbow-me/rainbowkit';

const costToken = bera["bera"];

export function useLuckyBera() {
  const { accountWithAk, provider, account, chainId } = useCustomAccount();
  const toast = useToast();
  const { setLastSpinResult, lastSpinResult } = useLuckyBeraStore();
  const connectModal = useConnectModal();

  const [buySpinsModalOpen, setBuySpinsModalOpen] = useState(false);

  const multipliers = Object.values(SpinMultiplier).filter(multiplier => typeof multiplier === "number");

  const [spinMultiplier, setSpinMultiplier] = useState<SpinMultiplier>(SpinMultiplier.X1);

  const [spinUserData, setSpinUserData] = useState<SpinUserData>();
  const { runAsync: getSpinUserData, loading: spinUserDataLoading } = useRequest<SpinUserData, any>(async () => {
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
    manual: true,
  });

  const { run: reloadSpinData } = useDebounceFn((_lastSpinResult: SpinResultData) => {
    // getSpinUserData();
    setSpinUserData((prev) => {
      return {
        ...prev,
        spin_balance: _lastSpinResult.spin_balance,
      } as SpinUserData;
    });
    if (SPIN_CATEGORIES[_lastSpinResult?.draw_reward as SpinCategory]) {
      setLastSpinResult(_lastSpinResult);
    }
  }, { wait: 5000 });

  const { runAsync: handleSpinResult, data: spinResultData, loading: spinResultDataLoading } = useRequest<SpinResultData | boolean, any>(async () => {
    if (!account) {
      connectModal?.openConnectModal?.();
      return;
    }
    if (!accountWithAk) return;
    if (!spinUserData?.spin_balance) {
      setBuySpinsModalOpen(true);
      return;
    }
    try {
      const res = await post("/api/go/game/777/draw", {
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
    if (!spinUserData?.spin_balance) return;
    let currIndex = multipliers.indexOf(spinMultiplier);
    let nextIndex = currIndex + 1;
    if (nextIndex >= multipliers.length - 1) nextIndex = 0;
    if (multipliers[nextIndex] > spinUserData.spin_balance) {
      nextIndex = 0;
    }
    setSpinMultiplier(multipliers[nextIndex]);
  };

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

  const [buySpinsAmount, setBuySpinsAmount] = useState("");
  const { runAsync: onBuySpins, loading: buyingSpins } = useRequest(async (params?: { discount?: number; amount?: string; }) => {
    if (!account) {
      connectModal?.openConnectModal?.();
      return;
    }
    let { discount, amount } = params ?? {};
    amount = amount || buySpinsAmount;

    if (!amount || Big(amount).lte(0)) {
      return;
    }

    let costBera = Big(amount).times(BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS).toFixed(costToken.decimals);
    if (discount) {
      costBera = Big(amount).div(Big(1).plus(discount)).times(BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS).toFixed(costToken.decimals);
    }

    let toastId: any = toast.loading({ title: "Paying..." });
    const signer = provider?.getSigner(account);
    try {
      const tx = {
        to: BUY_SPINS_CONTRACT_ADDRESS,
        value: ethers.utils.parseEther(costBera),
      };
      console.log("tx: %o", tx);
      const estimatedGas = await provider.estimateGas(tx);
      const gasLimit = estimatedGas.mul(120).div(100);
      const txResponse = await signer.sendTransaction({
        ...tx,
        gasLimit,
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Confirming..." });
      const { status, transactionHash } = await txResponse.wait();
      toast.dismiss(toastId);

      // reload spin data
      await getSpinUserData();

      if (status !== 1) {
        toast.fail({
          title: "Purchase failed, please try again later",
          chainId,
          tx: transactionHash,
        });
        return;
      }

      toast.success({
        title: "Purchase Successful",
        chainId,
        tx: transactionHash,
      });
    } catch (error: any) {
      toast.dismiss(toastId);
      const isRejected = error?.message?.includes("user rejected transaction");
      toast.fail({
        title: isRejected ? "User rejected transaction" : "Purchase failed, please try again later",
        text: isRejected ? "" : error?.message,
      });
    }
  }, {
    manual: true,
  });

  useEffect(() => {
    if (!accountWithAk) return;
    getSpinUserData();
  }, [accountWithAk]);

  return {
    spinUserData,
    spinUserDataLoading,
    spinMultiplier,
    handleSpinResult,
    spinResultData,
    spinResultDataLoading,
    toggleSpinMultiplier,
    lastSpinResult,
    buySpinsModalOpen,
    setBuySpinsModalOpen,
    onBuySpins,
    buyingSpins,
    buySpinsAmount,
    setBuySpinsAmount,
  };
}
