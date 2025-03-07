import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import bex from "@/configs/pools/bex";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { TOKENS } from "@/configs";

export default function useUserPools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();
  const contracts = bex.contracts[DEFAULT_CHAIN_ID];

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const listRes = await axios.post(bex.graph, {
        operationName: "GetPools",
        variables: {
          chain: "BERACHAIN",
          first: 10,
          orderBy: "totalLiquidity",
          orderDirection: "desc",
          skip: 0,
          userAddress: account
        },
        query:
          "query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection) {\n  poolGetPools(\n    textSearch: $textSearch\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    skip: $skip\n    where: {userAddress: $userAddress, chainIn: $chain}\n  ) {\n    ...MinimalPoolInList\n    __typename\n  }\n  count: poolGetPoolsCount(\n    textSearch: $textSearch\n    where: {userAddress: $userAddress, chainIn: $chain}\n  )\n}\n\nfragment MinimalPoolInList on GqlPoolMinimal {\n  id\n  name\n  address\n  factory\n  tokens: allTokens {\n    address\n    symbol\n    name\n    decimals\n    __typename\n  }\n  address\n  protocolVersion\n  type\n  dynamicData {\n    ...DynamicData\n    __typename\n  }\n  userBalance {\n    ...UserBalance\n    __typename\n  }\n  rewardVault {\n    ...RewardVault\n    __typename\n  }\n  __typename\n}\n\nfragment DynamicData on GqlPoolDynamicData {\n  totalShares\n  fees24h\n  volume24h\n  swapFee\n  isInRecoveryMode\n  isPaused\n  totalLiquidity\n  aprItems {\n    apr\n    type\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment UserBalance on GqlPoolUserBalance {\n  totalBalanceUsd\n  walletBalance\n  walletBalanceUsd\n  __typename\n}\n\nfragment RewardVault on GqlRewardVault {\n  dynamicData {\n    activeIncentivesValueUsd\n    apy\n    bgtCapturePercentage\n    allTimeReceivedBGTAmount\n    __typename\n  }\n  isVaultWhitelisted\n  vaultAddress\n  stakingTokenAddress\n  __typename\n}"
      });

      const _pools = listRes.data.data.poolGetPools.map((pool: any) => {
        const tokens = pool.tokens
          .filter((token: any) => token.name !== pool.name)
          .map((token: any) => {
            return {
              ...token,
              icon: TOKENS[token.address]?.icon,
              chainId: DEFAULT_CHAIN_ID
            };
          });
        return {
          id: pool.id,
          address: pool.address,
          tokens,
          symbol: pool.name,
          liquidity: pool.dynamicData.totalLiquidity,
          deposit: pool.userBalance.totalBalanceUsd,
          balance: pool.userBalance.walletBalance,
          shares: Big(pool.userBalance.totalBalanceUsd)
            .div(pool.dynamicData.totalLiquidity)
            .mul(100)
            .toString(),
          type: pool.type
        };
      });

      setPools(_pools);
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
