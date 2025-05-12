import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { useSettingsStore } from "@/stores/settings";
import { Contract } from "ethers";
import islandAbi from "../abi/island";
import Big from "big.js";
import { getAnotherAmountOutV2 } from "@/sections/pools/helpers";

export default function useDepositAmount(data: any, info?: any) {
  const [querying, setQuerying] = useState(false);
  const { provider } = useCustomAccount();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const queryAmounts = async ({ amount0, amount1, cb }: any) => {
    try {
      setQuerying(true);
      if (data.type === "v2") {
        const isToken0 = !!amount0;
        const amount = isToken0 ? amount0 : amount1;

        const amountOut = new Big(amount || 0).gt(0)
          ? getAnotherAmountOutV2({
              reserve0: info.reserve0,
              reserve1: info.reserve1,
              amount: amount,
              isToken0
            })
          : "";
        const _amount0 = isToken0 ? amount0 : amountOut;
        const _amount1 = isToken0 ? amountOut : amount1;

        const ts = Big(data.tokenLp.totalSupply).mul(
          10 ** data.tokenLp.decimals
        );
        const _r0 = Big(_amount0).mul(ts).div(info.reserve0);
        const _r1 = Big(_amount1).mul(ts).div(info.reserve1);
        const received = _r0.lt(_r1) ? _r0 : _r1;

        cb({
          amount0: _amount0,
          amount1: _amount1,
          received: received.toString(),
          miniReceived: received.mul(1 - slippage / 100).toString()
        });
        return;
      }

      const IslandContract = new Contract(data.id, islandAbi, provider);
      const params = amount0
        ? [
            Big(amount0)
              .mul(10 ** data.token0.decimals)
              .toFixed(0),
            "1157920892373161954235709850086879078532"
          ]
        : [
            "1157920892373161954235709850086879078532",
            Big(amount1)
              .mul(10 ** data.token1.decimals)
              .toFixed(0)
          ];

      const amountsRes = await IslandContract.getMintAmounts(...params);

      const _amount0 =
        amount0 ||
        Big(amountsRes[0].toString())
          .div(10 ** data.token0.decimals)
          .toString();
      const _amount1 =
        amount1 ||
        Big(amountsRes[1].toString())
          .div(10 ** data.token1.decimals)
          .toString();
      const received = Big(amountsRes[2].toString()).div(1e18).toString();

      cb({
        amount0: _amount0,
        amount1: _amount1,
        received,
        miniReceived: Big(received)
          .mul(1 - slippage / 100)
          .toString()
      });
    } catch (err) {
      console.log(err);
    } finally {
      setQuerying(false);
    }
  };

  return { querying, queryAmounts };
}
