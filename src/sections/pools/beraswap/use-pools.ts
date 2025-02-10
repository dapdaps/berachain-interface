import { useEffect, useState } from "react";
import axios from "axios";
import { beraB } from "@/configs/tokens/bera-bArtio";
import beraswap from "@/configs/pools/beraswap";
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
      const response = await axios.post(beraswap.graph, {
        operationName: "GetPools",
        query:
          "query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection) {\n  poolGetPools(\n    textSearch: $textSearch\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    skip: $skip\n    where: {userAddress: $userAddress, chainIn: $chain}\n  ) {\n    ...MinimalPoolInList\n    __typename\n  }\n  count: poolGetPoolsCount(\n    textSearch: $textSearch\n    where: {userAddress: $userAddress, chainIn: $chain}\n  )\n}\n\nfragment MinimalPoolInList on GqlPoolMinimal {\n  id\n  name\n  address\n  factory\n  tokens: allTokens {\n    address\n    symbol\n    name\n    decimals\n    __typename\n  }\n  address\n  protocolVersion\n  type\n  dynamicData {\n    ...DynamicData\n    __typename\n  }\n  userBalance {\n    ...UserBalance\n    __typename\n  }\n  rewardVault {\n    ...RewardVault\n    __typename\n  }\n  __typename\n}\n\nfragment DynamicData on GqlPoolDynamicData {\n  totalShares\n  fees24h\n  volume24h\n  swapFee\n  isInRecoveryMode\n  isPaused\n  totalLiquidity\n  aprItems {\n    apr\n    type\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment UserBalance on GqlPoolUserBalance {\n  totalBalanceUsd\n  walletBalance\n  walletBalanceUsd\n  __typename\n}\n\nfragment RewardVault on GqlRewardVault {\n  dynamicData {\n    activeIncentivesValueUsd\n    apy\n    bgtCapturePercentage\n    allTimeReceivedBGTAmount\n    __typename\n  }\n  isVaultWhitelisted\n  vaultAddress\n  stakingTokenAddress\n  __typename\n}",
        variables: {
          first: 9,
          skip: (p - 1) * 9,
          chain: "BERACHAIN",
          orderBy: "totalLiquidity",
          orderDirection: "desc"
        }
      });

      setHasMore(response.data.data.poolGetPools.length === 9);
      setPools(
        response.data.data.poolGetPools.map((pool: any) => {
          const tokens = pool.tokens.map((token: any) => {
            return {
              ...token,
              icon: TOKENS[token.address]?.icon,
              chainId: DEFAULT_CHAIN_ID
            };
          });
          return {
            tokens,
            tvl: pool.dynamicData.totalLiquidity,
            symbol: pool.name.symbol,
            id: pool.id,
            address: pool.address,
            poolType: pool.type
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
