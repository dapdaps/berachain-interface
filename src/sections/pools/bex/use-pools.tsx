import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import bex from "@/configs/pools/bex";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { multicall, multicallAddresses } from "@/utils/multicall";
import poolV2 from "../abi/pool-v2";
import { getTokenAmountsV2 } from "../helpers";
import { TOKENS } from "@/configs";
import weth from "@/configs/contract/weth";
import { usePriceStore } from "@/stores/usePriceStore";
import { balanceFormated } from "@/utils/balance";

export default function usePools(isSimple?: boolean) {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();
  const prices = usePriceStore((store: any) => store.price);

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const response = await axios.post(bex.graph[DEFAULT_CHAIN_ID], {
        operationName: "UserPools",
        query: `query UserPools($user: String) {\n  userPools(id: $user) {\n    depositedPools {\n      pool {\n        id\n        poolIdx\n        base\n        quote\n        timeCreate\n        tvlUsd\n        baseAmount\n        quoteAmount\n        bgtApy\n        template {\n          feeRate\n          __typename\n        }\n        baseInfo {\n          id\n          address\n          symbol\n          name\n          decimals\n          usdValue\n          beraValue\n          __typename\n        }\n        quoteInfo {\n          id\n          address\n          symbol\n          name\n          decimals\n          usdValue\n          beraValue\n          __typename\n        }\n        shareAddress {\n          address\n          __typename\n        }\n        latestPoolDayData {\n          tvlUsd\n          feesUsd\n          volumeUsd\n          __typename\n        }\n        vault {\n          id\n          vaultAddress\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}`,
        variables: {
          user: account?.toLowerCase()
        }
      });

      const data = response.data.data.userPools.depositedPools;
      if (!data) throw Error("No Pool");

      if (isSimple) {
        setPools(
          data.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.pool.base + "-" + curr.pool.quote]: true
            }),
            {}
          )
        );
        setLoading(false);
        return;
      }
      const balanceCalls = data.map(({ pool }: any) => ({
        address: pool.shareAddress.address,
        name: "balanceOf",
        params: [account]
      }));
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const supplyCalls = data.map(({ pool }: any) => ({
        address: pool.shareAddress.address,
        name: "totalSupply"
      }));
      const balanceResult = await multicall({
        abi: poolV2,
        options: {},
        calls: balanceCalls,
        multicallAddress,
        provider
      });
      const supplyResult = await multicall({
        abi: poolV2,
        options: {},
        calls: supplyCalls,
        multicallAddress,
        provider
      });

      setPools(
        data.map(({ pool }: any, i: number) => {
          const b = balanceResult[i][0].toString();
          const t = supplyResult[i][0].toString();
          const { amount0, amount1 } = getTokenAmountsV2({
            liquidity: b,
            totalSupply: t,
            reserve0: Big(pool.baseAmount)
              .mul(10 ** pool.baseInfo.decimals)
              .toString(),
            reserve1: Big(pool.quoteAmount)
              .mul(10 ** pool.quoteInfo.decimals)
              .toString()
          });
          const _weth = weth[DEFAULT_CHAIN_ID].toLowerCase();
          const token0 = {
            ...TOKENS[pool.base === _weth ? "native" : pool.base],
            address: pool.base
          };
          const token1 = {
            ...TOKENS[pool.quote === _weth ? "native" : pool.quote],
            address: pool.quote
          };

          const price0 = prices[token0.symbol || token0.priceKey];
          const price1 = prices[token1.symbol || token1.priceKey];

          const shares = Big(b).div(t).mul(100).toString();

          return {
            token0,
            token1,
            fee: pool.template.feeRate,
            amount0,
            amount1,
            shares: balanceFormated(shares, 2),
            deposit:
              price0 && price1
                ? balanceFormated(
                    Big(amount0)
                      .mul(price0)
                      .add(Big(amount1).mul(price1))
                      .toString(),
                    2
                  )
                : 0
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
    if (!account || !provider) return;
    queryPools();
  }, [account, provider]);

  return { pools, loading, queryPools };
}
