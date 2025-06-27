import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import useAddAction from "@/hooks/use-add-action";
import Big from "big.js";
import { Contract } from "ethers";
import routerAbi from "../abi/router";
import routerV2Abi from "../../../abi/router-v2";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { sortTokens } from "@/sections/pools/utils";
import { wrapNativeToken } from "@/sections/pools/utils";

export default function useDeposit({
  data,
  amount0,
  amount1,
  received,
  type,
  onSuccess,
  dapp
}: any) {
  const { poolConfig } = dapp ?? {};
  const { baultRouter } = poolConfig ?? {};
  const { baults } = data ?? {};
  const isBault = baults && baults.length > 0;

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
      const RouterContract = new Contract(
        (isBault && baultRouter) ? baultRouter : data.router,
        data.type === "v2" ? routerV2Abi : routerAbi,
        signer
      );
      const _amount0 = Big(amount0)
        .mul(10 ** data.token0.decimals)
        .toFixed(0);
      const _amount1 = Big(amount1)
        .mul(10 ** data.token1.decimals)
        .toFixed(0);
      const _amount0Min = new Big(_amount0)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);
      const _amount1Min = new Big(_amount1)
        .mul(1 - (slippage / 100 || 0.05))
        .toFixed(0);

      const nativeToken = data.token0.isNative
        ? data.token0
        : data.token1.isNative
        ? data.token1
        : null;

      let method = "";
      let params: any[] = [];
      const option = {
        value: data.token0.isNative
          ? _amount0
          : data.token1.isNative
          ? _amount1
          : 0
      };

      if (data.type === "v2") {
        const [_token0, _token1] = sortTokens(
          wrapNativeToken(data.token0),
          wrapNativeToken(data.token1)
        );
        const _deadline = Math.ceil(Date.now() / 1000) + 600;
        method = nativeToken ? "addLiquidityETH" : "addLiquidity";
        params = nativeToken
          ? [
              data.token0.isNative ? data.address : _token0.address,
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
      } else {
        method = nativeToken ? "addLiquidityNative" : "addLiquidity";
        params = [
          data.id,
          _amount0,
          _amount1,
          _amount0Min,
          _amount1Min,
          Big(received)
            .mul(1e18)
            .mul(1 - _slippage / 100)
            .toFixed(0),
          account
        ];
      }

     

      const estimateGas = await RouterContract.estimateGas[method](
        ...params,
        option
      );

      console.log("estimateGas", estimateGas.toString());

      const tx = await RouterContract[method](...params, {
        ...option,
        gasLimit: estimateGas
          ? Big(estimateGas.toString()).mul(1.2).toFixed(0)
          : 5000000
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
        if (type === "staking") {
          onSuccess();
        } else {
          onSuccess();
        }
      } else {
        toast.fail({ title: "Deposit failed!" });
      }

      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        tokens: [data.token0, data.token1],
        amounts: [amount0, amount1],
        template: "Kodiak",
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: {
          action: "Add Liquidity",
          type: "univ3"
        }
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
