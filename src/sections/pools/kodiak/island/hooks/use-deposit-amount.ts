import { useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { useSettingsStore } from "@/stores/settings";
import { Contract } from "ethers";
import islandAbi from "../abi/island";
import Big from "big.js";

export default function useDepositAmount({
  islandContract,
  token0,
  token1
}: any) {
  const [querying, setQuerying] = useState(false);
  const { provider } = useCustomAccount();
  const slippage = useSettingsStore((store: any) => store.slippage);

  const queryAmounts = async ({ amount0, amount1, cb }: any) => {
    try {
      setQuerying(true);
      const IslandContract = new Contract(islandContract, islandAbi, provider);
      const params = amount0
        ? [
            Big(amount0)
              .mul(10 ** token0.decimals)
              .toFixed(0),
            "1157920892373161954235709850086879078532"
          ]
        : [
            "1157920892373161954235709850086879078532",
            Big(amount1)
              .mul(10 ** token1.decimals)
              .toFixed(0)
          ];

      const amountsRes = await IslandContract.getMintAmounts(...params);

      const _amount0 =
        amount0 ||
        Big(amountsRes[0].toString())
          .div(10 ** token0.decimals)
          .toString();
      const _amount1 =
        amount1 ||
        Big(amountsRes[1].toString())
          .div(10 ** token1.decimals)
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
