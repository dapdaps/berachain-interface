import { useEffect, useState } from "react";
import axios from "axios";
import { TOKENS } from "@/configs";
import bex from "@/configs/pools/bex";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

export default function usePools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const onQuery = async () => {
    try {
      setLoading(true);
      setPools([]);
      const response = await axios.post(bex.graph, {
        operationName: "GetPools",
        query:
          "query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection) {\n  poolGetPools(\n    textSearch: $textSearch\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    skip: $skip\n    where: {userAddress: $userAddress, chainIn: $chain}\n  ) {\n    ...MinimalPoolInList\n    __typename\n  }\n  count: poolGetPoolsCount(\n    textSearch: $textSearch\n    where: {userAddress: $userAddress, chainIn: $chain}\n  )\n}\n\nfragment MinimalPoolInList on GqlPoolMinimal {\n  id\n  name\n  address\n  factory\n  tokens: allTokens {\n    address\n    symbol\n    name\n    decimals\n    __typename\n  }\n  address\n  protocolVersion\n  type\n  dynamicData {\n    ...DynamicData\n    __typename\n  }\n  userBalance {\n    ...UserBalance\n    __typename\n  }\n  rewardVault {\n    ...RewardVault\n    __typename\n  }\n  __typename\n}\n\nfragment DynamicData on GqlPoolDynamicData {\n  totalShares\n  fees24h\n  volume24h\n  swapFee\n  isInRecoveryMode\n  isPaused\n  totalLiquidity\n  aprItems {\n    apr\n    type\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment UserBalance on GqlPoolUserBalance {\n  totalBalanceUsd\n  walletBalance\n  walletBalanceUsd\n  __typename\n}\n\nfragment RewardVault on GqlRewardVault {\n  dynamicData {\n    activeIncentivesValueUsd\n    apr\n    bgtCapturePercentage\n    allTimeReceivedBGTAmount\n    __typename\n  }\n  isVaultWhitelisted\n  vaultAddress\n  stakingTokenAddress\n  __typename\n}",
        variables: {
          chain: "BERACHAIN",
          orderBy: "totalLiquidity",
          orderDirection: "desc"
          // first: 50,
          // skip: 0
        }
      });

      setPools(
        response.data.data.poolGetPools.map((pool: any) => {
          let _s: string[] = [];
          const tokens = pool.tokens
            .filter((token: any) => token.name !== pool.name)
            .map((token: any) => {
              _s.push(token.symbol);
              return {
                ...token,
                icon: TOKENS[token.address]?.icon,
                chainId: DEFAULT_CHAIN_ID
              };
            });
          return {
            tokens,
            tvl: pool.dynamicData.totalLiquidity,
            volume24h: pool.dynamicData.volume24h,
            fees24h: pool.dynamicData.fees24h,
            symbol: _s.length ? _s.join(" | ") : pool.name,
            id: pool.id,
            address: pool.address,
            poolType: pool.type,
            apr: pool?.dynamicData?.aprItems?.reduce(
              (acc: any, curr: any) =>
                Big(acc).plus(Big(curr?.apr ?? 0).times(100)),
              0
            ),
            bgtApr: Big(pool?.rewardVault?.dynamicData?.apr ?? 0)
              .times(100)
              .toFixed(),
            vaultAddress: pool?.rewardVault?.vaultAddress
          };
        })
      );
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onQuery();
  }, []);

  return { pools, loading };
}
