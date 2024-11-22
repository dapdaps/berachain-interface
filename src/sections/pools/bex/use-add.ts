import Big from "big.js";
import { Contract, utils } from "ethers";
import { useState } from "react";

import useAccount from "@/hooks/use-account";
import useAddAction from "@/hooks/use-add-action";
import useToast from "@/hooks/use-toast";
import { useSettingsStore } from "@/stores/settings";
import { wrapNativeToken, sortTokens } from "../utils";
import abi from "./abi";
import bex from "@/configs/pools/bex";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function usdAdd({
  token0,
  token1,
  value0,
  value1,
  poolIdx,
  lpAddress,
  onSuccess
}: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider, chainId } = useAccount();
  const toast = useToast();
  const slippage = useSettingsStore((store: any) => store.slippage);
  const contracts = bex.contracts[DEFAULT_CHAIN_ID];
  const { addAction } = useAddAction("dapp");

  const onIncrease = async () => {
    if (!contracts) return;
    setLoading(true);

    let toastId = toast.loading({ title: "Confirming..." });

    try {
      const [_token0, _token1] = sortTokens(
        wrapNativeToken(token0),
        wrapNativeToken(token1)
      );
      const queryContract = new Contract(contracts.CrocQuery, abi, provider);
      const limitResponse = await queryContract.queryPrice(
        _token0.address,
        _token1.address,
        poolIdx
      );
      const limitLower = Big(limitResponse)
        .mul(1 - slippage / 100)
        .toFixed(0);
      const limitHigher = Big(limitResponse)
        .mul(1 + slippage / 100)
        .toFixed(0);

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

      const signer = provider.getSigner(account);

      const RouterContract = new Contract(contracts.CrocSwapDex, abi, signer);

      let value = "0";

      if (hasNativeToken) {
        value = _token0.isNative ? _amount0 : _amount1;
      }
      const method = "userCmd";

      const cmd = utils.defaultAbiCoder.encode(
        [
          "uint8",
          "address",
          "address",
          "uint256",
          "int24",
          "int24",
          "uint128",
          "uint128",
          "uint128",
          "uint8",
          "address"
        ],
        [
          isReverse || _token1.isNative ? 32 : 31,
          _token0.isNative
            ? "0x0000000000000000000000000000000000000000"
            : _token0.address,
          _token1.isNative
            ? "0x0000000000000000000000000000000000000000"
            : _token1.address,
          poolIdx,
          0,
          0,
          isReverse || _token1.isNative ? _amount1 : _amount0,
          limitLower,
          limitHigher,
          0,
          lpAddress
        ]
      );
      const params = [128, cmd];

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
          title: "Add successfully!",
          tx: transactionHash,
          chainId
        });
        onSuccess();
      } else {
        toast.fail({ title: "Add faily!" });
      }
      addAction({
        type: "Liquidity",
        action: "Add Liquidity",
        token0: token0.symbol,
        token1: token1.symbol,
        template: "Bex",
        status,
        transactionHash,
        sub_type: "Add",
        extra_data: JSON.stringify({
          amount0: value0,
          amount1: value1,
          token0Symbol: token0.symbol,
          token1Symbol: token1.symbol,
          action: "Add Liquidity",
          type: "univ3"
        })
      });
      setLoading(false);
    } catch (err: any) {
      console.log(err);
      toast.dismiss(toastId);
      setLoading(false);
      toast.fail({
        title: err?.message?.includes("user rejected transaction")
          ? "User rejected transaction"
          : `Add faily!`
      });
    }
  };

  return { loading, onIncrease };
}
