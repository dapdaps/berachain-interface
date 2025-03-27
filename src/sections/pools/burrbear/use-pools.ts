import { useEffect, useState } from "react";
import axios from "axios";
import { beraB } from "@/configs/tokens/bera-bArtio";
import burrbear from "@/configs/pools/burrbear";
import { DEFAULT_CHAIN_ID } from "@/configs";

const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);

export default function usePools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const onQuery = async (p: number) => {
    try {
      setLoading(true);
      setPools([]);
      const response = await axios.post(burrbear.graph[DEFAULT_CHAIN_ID], {
        query:
          "query Pools($skip: Int, $first: Int, $orderBy: Pool_orderBy, $orderDirection: OrderDirection, $where: Pool_filter, $block: Block_height) {\n  pools(\n    skip: $skip\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n    block: $block\n  ) {\n    ...SubgraphPool\n  }\n}\n\nfragment SubgraphPool on Pool {\n  id\n  address\n  poolType\n  poolTypeVersion\n  factory\n  strategyType\n  symbol\n  name\n  swapEnabled\n  swapFee\n  protocolYieldFeeCache\n  protocolSwapFeeCache\n  owner\n  totalWeight\n  totalSwapVolume\n  totalSwapFee\n  totalLiquidity\n  totalShares\n  tokens(first: 100, orderBy: index) {\n    ...SubgraphPoolToken\n  }\n  swapsCount\n  holdersCount\n  tokensList\n  amp\n  priceRateProviders(first: 100) {\n    ...SubgraphPriceRateProvider\n  }\n  expiryTime\n  unitSeconds\n  createTime\n  principalToken\n  baseToken\n  wrappedIndex\n  mainIndex\n  lowerTarget\n  upperTarget\n  sqrtAlpha\n  sqrtBeta\n  root3Alpha\n  isInRecoveryMode\n  isPaused\n  alpha\n  beta\n  c\n  s\n  lambda\n  tauAlphaX\n  tauAlphaY\n  tauBetaX\n  tauBetaY\n  u\n  v\n  w\n  z\n  dSq\n  delta\n  epsilon\n  quoteToken\n}\n\nfragment SubgraphPoolToken on PoolToken {\n  id\n  symbol\n  name\n  decimals\n  address\n  balance\n  managedBalance\n  weight\n  priceRate\n  isExemptFromYieldProtocolFee\n  token {\n    ...TokenTree\n  }\n}\n\nfragment TokenTree on Token {\n  latestUSDPrice\n  latestFXPrice\n  pool {\n    ...SubgraphSubPool\n    tokens(first: 100, orderBy: index) {\n      ...SubgraphSubPoolToken\n      token {\n        latestUSDPrice\n        pool {\n          ...SubgraphSubPool\n          tokens(first: 100, orderBy: index) {\n            ...SubgraphSubPoolToken\n            token {\n              latestUSDPrice\n              pool {\n                ...SubgraphSubPool\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment SubgraphSubPool on Pool {\n  id\n  totalShares\n  address\n  poolType\n  mainIndex\n}\n\nfragment SubgraphSubPoolToken on PoolToken {\n  address\n  balance\n  weight\n  priceRate\n  symbol\n  decimals\n  isExemptFromYieldProtocolFee\n}\n\nfragment SubgraphPriceRateProvider on PriceRateProvider {\n  address\n  token {\n    address\n  }\n}\n",
        variables: {
          first: 9,
          skip: (p - 1) * 9,
          orderBy: "totalLiquidity",
          orderDirection: "desc",
          where: {
            id_not_in: [
              "0x4dff2ceaf65cac188a8d481f34f3be9cd3d54d6c000000000000000000000007",
              "0x143ab24a1562bfec7a0695dde552e1ee5daace1b000200000000000000000001",
              "0xdda245377ce251114929beefcc8bbb6793e22cbd000000000000000000000003",
              "0xecaa8ee11396d52421a1388d229dffb85bf4c3f2000200000000000000000002",
              "0xd6671d907b7f791de7d9f89fba1a04d55d669a8300000000000000000000000c"
            ],
            tokensList_contains: [],
            poolType_in: ["Weighted", "ComposableStable", "FX"],
            totalLiquidity_gt: -1
          },
          chainId: DEFAULT_CHAIN_ID
        },
        operationName: "Pools"
      });
      setHasMore(response.data.data.pools.length === 9);
      setPools(
        response.data.data.pools.map((pool: any) => {
          const tokens = pool.tokens
            .filter((token: any) => token.symbol !== pool.symbol)
            .map((token: any) => {
              return {
                ...token,
                icon: TOKENS[token.address]?.icon,
                chainId: DEFAULT_CHAIN_ID
              };
            });
          return {
            tokens,
            tvl: pool.totalLiquidity,
            symbol: pool.symbol,
            id: pool.id,
            address: pool.address,
            poolType: pool.poolType
          };
        })
      );
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  const onNextPage = (p: number) => {
    setPage(p);
    onQuery(p);
  };

  useEffect(() => {
    onQuery(page);
  }, []);

  return { pools, loading, page, hasMore, onNextPage };
}
