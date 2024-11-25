import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import kodiak from "@/configs/pools/kodiak";
import { multicall, multicallAddresses } from "@/utils/multicall";
import poolV2 from "../abi/pool-v2";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { getTokenAmountsV2 } from "../helpers";
import { TOKENS } from "@/configs";
import { usePriceStore } from "@/stores/usePriceStore";
import { balanceFormated } from "@/utils/balance";

export default function usePoolsV2(isSimple?: boolean) {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { account, provider } = useAccount();
  const prices = usePriceStore((store: any) => store.price);

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.post(kodiak.graph[DEFAULT_CHAIN_ID], {
        operationName: "UserPools",
        query: `query MyQuery {\n  user(id: \"${account?.toLowerCase()}\") {\n    liquidityPositions {\n      pair {\n        id\n        reserve0\n        reserve1\n        totalSupply\n        token1 {\n          id\n          name\n          decimals\n          symbol\n        }\n        token0 {\n          id\n          decimals\n          symbol\n          name\n        }\n      }\n    }\n  }\n}`
      });

      const data = response.data.data?.user?.liquidityPositions ?? null;

      if (!data) throw Error("No Pool");
      if (isSimple) {
        setPools(
          data.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.pair.token0.id + "-" + curr.pair.token1.id]: true
            }),
            {}
          )
        );
        setLoading(false);
        return;
      }

      const balanceCalls = data.map(({ pair }: any) => ({
        address: pair.id,
        name: "balanceOf",
        params: [account]
      }));
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const balanceResult = await multicall({
        abi: poolV2,
        options: {},
        calls: balanceCalls,
        multicallAddress,
        provider
      });

      setPools(
        data.map(({ pair }: any, i: number) => {
          const t = Big(pair.totalSupply || 0)
            .mul(1e18)
            .toString();
          const b = balanceResult[i][0].toString();

          const { amount0, amount1 } = getTokenAmountsV2({
            liquidity: b,
            totalSupply: t,
            reserve0: Big(pair.reserve0)
              .mul(10 ** pair.token0.decimals)
              .toString(),
            reserve1: Big(pair.reserve1)
              .mul(10 ** pair.token1.decimals)
              .toString()
          });
          const token0 = TOKENS[pair.token0.id] || pair.token0;
          const token1 = TOKENS[pair.token1.id] || pair.token1;
          const price0 = prices[token0.symbol || token0.priceKey];
          const price1 = prices[token1.symbol || token1.priceKey];

          const deposit =
            price0 && price1 && amount0 && amount1
              ? balanceFormated(
                  Big(price0)
                    .mul(amount0)
                    .add(Big(price1).mul(amount1))
                    .toString(),
                  2
                )
              : "";

          const shares = Big(b).div(t).mul(100).toFixed(2);

          return {
            token0,
            token1,
            amount0,
            amount1,
            deposit,
            shares,
            id: `${pair.token0}-${pair.token1}`
          };
        })
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
      setPools([]);
    }
  }, [account, provider]);

  useEffect(() => {
    if (!account || !provider) {
      setLoading(false);
      return;
    }
    queryPools();
  }, [account, provider]);

  return { pools, loading, queryPools };
}
