import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { TOKENS } from "@/configs";

export default function useUserPools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const listRes = await axios.post("https://api.berachain.com/", {
        operationName: "GetPools",
        variables: {
          chain: "BERACHAIN",
          first: 1000,
          orderBy: "totalLiquidity",
          orderDirection: "desc",
          skip: 0,
          userAddress: "0x229E549c97C22b139b8C05fba770D94C086853d8",
          blacklistedPoolIds: [
            "0xf79cc6a5283ee858d7bc24fd5565ddbb941cce0900000000000000000000006b",
            "0x1978ce23de87d5ee2988d1dfb677e7dd5bd2a8a70002000000000000000000b7",
            "0x823852de5da466ae8ae0b7be8e19b7b81e4112c6000200000000000000000080",
            "0x01c8a4a1afdcbd8254ba145e76c027c76421cc920002000000000000000000ba",
            "0xabbb3ee61f2df1ee940d3a2fb2214ad6ce34de130000000000000000000000f8",
            "0x178fa5bad56ac4a6f13a72093c29599e20e0d056000200000000000000000086"
          ]
        },
        query:
          "query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection, $blacklistedPoolIds: [String!]) {\n  poolGetPools(\n    textSearch: $textSearch\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    skip: $skip\n    where: {userAddress: $userAddress, chainIn: $chain, idNotIn: $blacklistedPoolIds}\n  ) {\n    ...MinimalPoolInList\n    __typename\n  }\n  count: poolGetPoolsCount(\n    textSearch: $textSearch\n    where: {userAddress: $userAddress, chainIn: $chain}\n  )\n}\n\nfragment MinimalPoolInList on GqlPoolMinimal {\n  id\n  name\n  address\n  factory\n  tokens: allTokens {\n    address\n    symbol\n    name\n    decimals\n    __typename\n  }\n  address\n  protocolVersion\n  type\n  dynamicData {\n    ...DynamicData\n    __typename\n  }\n  userBalance {\n    ...UserBalance\n    __typename\n  }\n  rewardVault {\n    ...RewardVault\n    __typename\n  }\n  __typename\n}\n\nfragment DynamicData on GqlPoolDynamicData {\n  totalShares\n  fees24h\n  volume24h\n  swapFee\n  isInRecoveryMode\n  isPaused\n  totalLiquidity\n  aprItems {\n    apr\n    type\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment UserBalance on GqlPoolUserBalance {\n  totalBalanceUsd\n  walletBalance\n  walletBalanceUsd\n  __typename\n}\n\nfragment RewardVault on GqlRewardVault {\n  dynamicData {\n    activeIncentivesValueUsd\n    apr\n    bgtCapturePercentage\n    allTimeReceivedBGTAmount\n    __typename\n  }\n  isVaultWhitelisted\n  vaultAddress\n  stakingTokenAddress\n  __typename\n}"
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
          shares:
            !Big(pool.dynamicData.totalLiquidity).eq(0) &&
            Big(pool.userBalance.totalBalanceUsd)
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
