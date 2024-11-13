import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import islandAbi from "../abi/island";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useDeposit({
  data,
  amount0,
  amount1,
  received,
  type,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const onDeposit = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RouterContract = new Contract(data.router, routerAbi, signer);
      const _amount0 = Big(amount0).mul(10 ** data.token0.decimals);
      const _amount1 = Big(amount1).mul(10 ** data.token1.decimals);
      const nativeToken = data.token0.isNative
        ? data.token0
        : data.token1.isNative
        ? data.token1
        : null;

      const tx = await RouterContract[
        nativeToken ? "addLiquidityETH" : "addLiquidity"
      ](
        data.id,
        _amount0.toFixed(0),
        _amount1.toFixed(0),
        _amount0.mul(1 - slippage / 100).toFixed(0),
        _amount1.mul(1 - slippage / 100).toFixed(0),
        Big(received)
          .mul(1e18)
          .mul(1 - slippage / 100)
          .toFixed(0),
        account,
        {
          value: data.token0.isNative
            ? _amount0.toFixed(0)
            : data.token1.isNative
            ? _amount1.toFixed(0)
            : 0
        }
      );
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const res = await tx.wait();
      const { status, transactionHash } = res;
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Deposit successfully!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        if (type === "staking") {
          const IslandContract = new Contract(data.id, islandAbi, provider);
          const balanceRes = await IslandContract.balanceOf(account);
          onSuccess(
            Big(balanceRes.toString() || 0)
              .div(1e18)
              .toString()
          );
        } else {
          onSuccess();
        }
      } else {
        toast.fail({ title: "Deposit faily!" });
      }
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Deposit faily!`
      });
    }
  };

  return { loading, onDeposit };
}
