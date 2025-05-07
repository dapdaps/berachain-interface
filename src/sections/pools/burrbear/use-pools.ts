import { useEffect, useState } from "react";
import axios from "axios";
import { bera } from "@/configs/tokens/bera";
import burrbear from "@/configs/pools/burrbear";
import { DEFAULT_CHAIN_ID } from "@/configs";
import usePoolsApr from "./use-pools-apr";

const TOKENS: Record<string, any> = Object.values(bera).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);

export default function usePools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const { poolsWithApr } = usePoolsApr(pools);

  const onQuery = async (p: number) => {
    try {
      setLoading(true);
      setPools([]);
      const response = await axios.post(burrbear.graph, {
        query:
          "query Pools(\n  $skip: Int, \n  $first: Int, \n  $orderBy: Pool_orderBy, \n  $orderDirection: OrderDirection, \n  $where: Pool_filter, \n  $block: Block_height\n) {\n  pools(\n    skip: $skip\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    where: $where\n    block: $block  \n  ) {\n    ...SubgraphPool\n  }\n}\nfragment SubgraphPool on Pool {\n  id\n  address\n  poolType\n  poolTypeVersion\n  factory\n  strategyType\n  symbol\n  name\n  swapEnabled\n  swapFee\n  protocolYieldFeeCache\n  protocolSwapFeeCache\n  owner\n  totalWeight\n  totalSwapVolume\n  totalSwapFee\n  totalLiquidity\n  totalShares\n  tokens(first: 100, orderBy: index) {\n    ...SubgraphPoolToken\n  }\n  tokensList\n  createTime\n  mainIndex\n  isPaused\n  snapshots(orderBy:timestamp,orderDirection: desc, first: 2){\n    swapFees,\n    liquidity,\n    timestamp\n  }\n}\nfragment SubgraphPoolToken on PoolToken {\n  id\n  symbol\n  name\n  decimals\n  address\n  balance\n  managedBalance\n  weight\n  priceRate\n  isExemptFromYieldProtocolFee\n  token {\n    ...TokenTree\n  }\n}\nfragment TokenTree on Token {\n  latestUSDPrice\n  latestFXPrice\n}\nfragment SubgraphSubPool on Pool {\n  id\n  totalShares\n  address\n  poolType\n  mainIndex\n}\nfragment SubgraphSubPoolToken on PoolToken {\n  address\n  balance\n  weight\n  priceRate\n  symbol\n  decimals\n  isExemptFromYieldProtocolFee\n}",
        variables: {
          first: 10,
          orderBy: "totalLiquidity",
          orderDirection: "desc",
          where: {
            id_in: [
              "0xd10e65a5f8ca6f835f2b1832e37cf150fb955f23000000000000000000000004",
              "0x567f32e86be3e3963cdbc1887b5043b701f113d9000000000000000000000006",
              "0xe416c064946112c1626d6700d1081a750b1b1dd7000200000000000000000008",
              "0xd170e25f6bcb5ace2108628c647be47d59900ade00020000000000000000000c",
              "0x7ce7cb1893cfbd680cbfb9dd2a9ae6a62bde66a800000000000000000000000d",
              "0x935553cd13b5e0fc4c17bbd105b15b5e62a2eb7100020000000000000000000e",
              "0xac8a437d1e6905e419431662aead90fb04ac300800020000000000000000000f"
            ],
            tokensList_contains: [],
            poolType_in: ["Weighted", "ComposableStable", "FX"],
            totalLiquidity_gt: -1
          }
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
            poolType: pool.poolType,
            volume: pool.totalSwapVolume,
            totalShares: pool.totalShares,
            snapshots: pool.snapshots,
            aprLoading: true
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

  return { pools: poolsWithApr, loading, page, hasMore, onNextPage };
}
