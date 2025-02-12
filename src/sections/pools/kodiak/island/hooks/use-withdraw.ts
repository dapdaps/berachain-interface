import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import islandAbi from "../abi/island";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { getTokenAmountsV2 } from "../../../helpers";

export default function useWithdraw({ data, amount, onSuccess, onError }: any) {
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
      const RouterContract = new Contract(data.router, routerAbi, signer);
      const reverses = await IslandContract.getUnderlyingBalances();
      const totalSupply = await IslandContract.totalSupply();
      const liquidity = Big(amount).mul(1e18).toFixed(0);
      const { amount0, amount1 } = getTokenAmountsV2({
        liquidity,
        totalSupply: totalSupply.toString(),
        reserve0: reverses[0].toString(),
        reserve1: reverses[1].toString(),
        token0: data.token0,
        token1: data.token1
      });
      const _amount0 = Big(amount0).mul(10 ** data.token0.decimals);
      const _amount1 = Big(amount1).mul(10 ** data.token1.decimals);

      const tx = await RouterContract[
        data.token0.isNative || data.token1.isNative
          ? "removeLiquidityNative"
          : "removeLiquidity"
      ](
        data.id,
        liquidity,
        _amount0.mul(1 - _slippage / 100).toFixed(0),
        _amount1.mul(1 - _slippage / 100).toFixed(0),
        account
      );
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
      onError();
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
