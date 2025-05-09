import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import routerV2Abi from "../../../abi/router-v2";
import islandAbi from "../abi/island";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { getTokenAmountsV2 } from "../../../helpers";

export default function useWithdraw({
  data,
  amount,
  info,
  onSuccess,
  onError
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);
  const { addAction } = useAddAction("dapp");

  const onWithdraw = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    const _slippage = slippage < 1 ? 1 : slippage;
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const IslandContract = new Contract(data.id, islandAbi, provider);
      const RouterContract = new Contract(
        data.router,
        data.type === "v2" ? routerV2Abi : routerAbi,
        signer
      );
      const totalSupply = Big(data.tokenLp.totalSupply || 0)
        .mul(10 ** data.tokenLp.decimals)
        .toString();
      const liquidity = Big(amount).mul(1e18).toFixed(0);
      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity,
        totalSupply: totalSupply.toString(),
        reserve0: info.reserve0,
        reserve1: info.reserve0,
        token0: data.token0,
        token1: data.token1
      });
      const _amount0 = Big(amount0).mul(10 ** data.token0.decimals);
      const _amount1 = Big(amount1).mul(10 ** data.token1.decimals);
      const _amount0Min = new Big(_amount0)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);
      const _amount1Min = new Big(_amount1)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);

      let method = "";
      let params: any[] = [];
      const hasNativeToken = data.token0.isNative
        ? true
        : data.token1.isNative
        ? false
        : "";

      if (data.type === "v2") {
        method =
          data.token0.isNative || data.token1.isNative
            ? "removeLiquidityETH"
            : "removeLiquidity";
        const deadline = Math.ceil(Date.now() / 1000) + 180;
        params = hasNativeToken
          ? [
              data.token0.isNative ? data.token1.address : data.token0.address,
              liquidity,
              0,
              0,
              account,
              deadline
            ]
          : [
              data.token0.address,
              data.token1.address,
              liquidity,
              0,
              0,
              account,
              deadline
            ];
      }

      if (data.type === "island") {
        method = hasNativeToken ? "removeLiquidityNative" : "removeLiquidity";
        params = [data.id, liquidity, _amount0Min, _amount1Min, account];
      }

      const tx = await RouterContract[method](...params);
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Withdraw successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Withdraw failed!" });
      }

      addAction({
        type: "Liquidity",
        action: "Remove Liquidity",
        tokens: [data.token0, data.token1],
        amounts: [amount0, amount1],
        template: "Kodiak",
        status,
        transactionHash,
        sub_type: "Remove",
        extra_data: {
          action: "Remove Liquidity",
          type: "univ3"
        }
      });
    } catch (err: any) {
      console.log(err);
      onError?.();
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Withdraw failed!`
      });
    }
  };

  return { loading, onWithdraw };
}
