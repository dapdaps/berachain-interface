import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useDeposit({
  data,
  amount0,
  amount1,
  received,
  type,
  mode,
  singleData,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);
  const { addAction } = useAddAction("dapp");

  const onDeposit = async () => {
    let toastId = toast.loading({ title: "Confirming..." });
    const _slippage = slippage < 1 ? 1 : slippage;
    try {
      setLoading(true);
      const signer = provider.getSigner(account);
      const RouterContract = new Contract(data.router, routerAbi, signer);
      const _amount0 = Big(amount0).mul(10 ** data.token0.decimals);
      const _amount1 = Big(amount1).mul(10 ** data.token1.decimals);
      const _minReceived = Big(received)
        .mul(1e18)
        .mul(1 - _slippage / 100)
        .toFixed(0);

      let method = "";
      let params: any = [];
      let options: any = {};

      if (mode === "double") {
        const nativeToken = data.token0.isNative
          ? data.token0
          : data.token1.isNative
          ? data.token1
          : null;
        method = nativeToken ? "addLiquidityNative" : "addLiquidity";
        params = [
          data.id,
          _amount0.toFixed(0),
          _amount1.toFixed(0),
          _amount0.mul(1 - _slippage / 100).toFixed(0),
          _amount1.mul(1 - _slippage / 100).toFixed(0),
          _minReceived,
          account
        ];
        options = {
          value: data.token0.isNative
            ? _amount0.toFixed(0)
            : data.token1.isNative
            ? _amount1.toFixed(0)
            : 0
        };
      } else {
        const { singleIndex, swapData } = singleData;
        const nativeToken =
          singleIndex === 0 && data.token0.isNative
            ? data.token0
            : singleIndex === 0 && data.token1.isNative
            ? data.token1
            : null;
        const singleAmount =
          singleIndex === 0 ? _amount0.mul(2) : _amount1.mul(2);
        const _a0 = singleIndex === 0 ? _amount0 : _amount1;
        const _a1 = singleIndex === 0 ? _amount1 : _amount0;

        method = nativeToken
          ? "addLiquiditySingleNative"
          : "addLiquiditySingle";

        params = [
          data.id,
          0,
          100,
          [
            _a0.toFixed(0),
            _a1.mul(1 - _slippage / 100).toFixed(0),
            !!nativeToken,
            swapData
          ],
          account
        ];
        if (!nativeToken) {
          params.splice(1, 0, singleAmount.toFixed(0));
        }
        options = {
          value: nativeToken ? singleAmount.toFixed(0) : 0
        };
      }
      let estimateGas: any = new Big(1000000);
      try {
        estimateGas = await RouterContract.estimateGas[method](
          ...params,
          options
        );
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const tx = await RouterContract[method](...params, {
        ...options,
        gasLimit: new Big(estimateGas).mul(1.2).toFixed(0)
      });
      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });
      const res = await tx.wait();
      const { status, transactionHash } = res;
      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Deposit successful!",
          tx: transactionHash,
          chainId: DEFAULT_CHAIN_ID
        });
        onSuccess();
      } else {
        toast.fail({ title: "Deposit failed!" });
      }
      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        token0: data.token0.symbol,
        token1: data.token1.symbol,
        template: "Kodiak",
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: JSON.stringify({
          amount0: amount0,
          amount1: amount1,
          action: "Add Liquidity",
          type: "univ3",
          token0Symbol: data.token0.symbol,
          token1Symbol: data.token1.symbol
        })
      });
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Deposit failed!`
      });
    }
  };

  return { loading, onDeposit };
}
