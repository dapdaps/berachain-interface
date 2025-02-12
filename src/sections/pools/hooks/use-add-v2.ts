import Big from "big.js";
import { Contract } from "ethers";
import { useState } from "react";
import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import { wrapNativeToken, sortTokens } from "../utils";
import routerAbi from "../abi/router-v2";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useAddV2({
  token0,
  token1,
  value0,
  value1,
  dex,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const { addAction } = useAddAction("dapp");

  const onIncrease = async () => {
    setLoading(true);

    let toastId = toast.loading({ title: "Confirming..." });

    try {
      const [_token0, _token1] = sortTokens(
        wrapNativeToken(token0),
        wrapNativeToken(token1)
      );
      const hasNativeToken = token0.isNative
        ? token0
        : token1.isNative
        ? token1
        : "";
      const isReverse =
        _token0.address !== token0.address &&
        _token1.address !== token1.address;
      const _value0 = isReverse ? value1 : value0;
      const _value1 = isReverse ? value0 : value1;
      const _amount0 = new Big(_value0 || 1)
        .mul(10 ** _token0.decimals)
        .toFixed(0);
      const _amount1 = new Big(_value1 || 1)
        .mul(10 ** _token1.decimals)
        .toFixed(0);
      const _amount0Min = new Big(_amount0)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);
      const _amount1Min = new Big(_amount1)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);
      const _deadline = Math.ceil(Date.now() / 1000) + 600;

      const signer = provider.getSigner(account);

      const method = hasNativeToken ? "addLiquidityETH" : "addLiquidity";

      const params = hasNativeToken
        ? [
            _token0.isNative ? _token1.address : _token0.address,
            _token0.isNative ? _amount1 : _amount0,
            _token0.isNative ? _amount1Min : _amount0Min,
            _token0.isNative ? _amount0 : _amount1,
            account,
            _deadline
          ]
        : [
            _token0.address,
            _token1.address,
            _amount0,
            _amount1,
            _amount0Min,
            _amount1Min,
            account,
            _deadline
          ];

      const RouterContract = new Contract(
        dex.contracts[DEFAULT_CHAIN_ID].RouterV2,
        routerAbi,
        signer
      );

      let value = "0";

      if (hasNativeToken) {
        value = _token0.isNative ? _amount0 : _amount1;
      }

      let estimateGas: any = new Big(1000000);

      try {
        estimateGas = await RouterContract.estimateGas[method](...params, {
          value
        });
      } catch (err: any) {
        console.log("estimateGas err", err);
        if (err?.code === "UNPREDICTABLE_GAS_LIMIT") {
          estimateGas = new Big(3000000);
        }
      }
      console.log("estimateGas", estimateGas.toString());
      const tx = await RouterContract[method](...params, {
        value,
        gasLimit: new Big(estimateGas).mul(120).div(100).toFixed(0)
      });

      toast.dismiss(toastId);
      toastId = toast.loading({ title: "Pending..." });

      const { status, transactionHash } = await tx.wait();

      toast.dismiss(toastId);
      if (status === 1) {
        toast.success({
          title: "Add successful!",
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: "Add failed!" });
      }
      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        tokens: [token0, token1],
        amounts: [value0, value1],
        template: dex.name,
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: {
          action: "Add Liquidity",
          type: "univ3"
        }
      });
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Add failed!`
      });
    }
  };

  return { loading, onIncrease };
}
