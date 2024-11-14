import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useWithdraw({
  data,
  amount,
  amount0,
  amount1,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);
  const { addAction } = useAddAction("dapp");

  const onWithdraw = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RouterContract = new Contract(data.router, routerAbi, signer);
      const _amount0 = Big(amount0).mul(10 ** data.token0.decimals);
      const _amount1 = Big(amount1).mul(10 ** data.token1.decimals);
      const liquidity = Big(amount)
        .mul(10 ** data.token1.decimals)
        .toFixed(0);
      const tx = await RouterContract[
        data.token0.isNative || data.token1.isNative
          ? "removeLiquidityETH"
          : "removeLiquidity"
      ](
        data.id,
        liquidity,
        _amount0.mul(1 - slippage / 100).toFixed(0),
        _amount1.mul(1 - slippage / 100).toFixed(0),
        account
      );
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const { status, transactionHash } = await tx.wait();
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Withdraw successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Withdraw faily!" });
      }
      addAction({
        type: "Liquidity",
        action: "Remove Liquidity",
        token0: data.token0.symbol,
        token1: data.token1.symbol,
        template: "Kodiak",
        status,
        transactionHash,
        sub_type: "Remove",
        extra_data: JSON.stringify({
          amount0,
          amount1,
          action: "Remove Liquidity",
          type: "univ3"
        })
      });
    } catch (err: any) {
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Withdraw faily!`
      });
    }
  };

  return { loading, onWithdraw };
}
