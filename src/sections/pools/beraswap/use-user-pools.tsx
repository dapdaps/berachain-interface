import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import beraswap from "@/configs/pools/beraswap";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { multicall, multicallAddresses } from "@/utils/multicall";
import poolAbi from "../abi/balancer-pool";
import valutAbi from "../abi/balancer-valut";
import { TOKENS } from "@/configs";

export default function useUserPools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();
  const contracts = beraswap.contracts[DEFAULT_CHAIN_ID];

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const shares = await axios.post("", {
        query: `query PoolShares{\n  poolShares(first: 1000,where: {balance_gt: 0.000001,userAddress:\"${account?.toLowerCase()}\"}){\n     poolId { id,address,symbol,tokensList,tokens{\n      address,\n      decimals,\n      symbol,\n      name\n    } } \n     balance \n  }\n}`
      });
      const pricesRes = await axios.post(beraswap.graph, {
        operationName: "GetPools",
        query:
          "query GetPools($textSearch: String, $first: Int, $userAddress: String, $chain: [GqlChain!]!, $orderBy: GqlPoolOrderBy, $skip: Int, $orderDirection: GqlPoolOrderDirection) {\n  poolGetPools(\n    textSearch: $textSearch\n    first: $first\n    orderBy: $orderBy\n    orderDirection: $orderDirection\n    skip: $skip\n    where: {userAddress: $userAddress, chainIn: $chain}\n  ) {\n    ...MinimalPoolInList\n    __typename\n  }\n  count: poolGetPoolsCount(\n    textSearch: $textSearch\n    where: {userAddress: $userAddress, chainIn: $chain}\n  )\n}\n\nfragment MinimalPoolInList on GqlPoolMinimal {\n  id\n  name\n  address\n  factory\n  tokens: allTokens {\n    address\n    symbol\n    name\n    decimals\n    __typename\n  }\n  address\n  protocolVersion\n  type\n  dynamicData {\n    ...DynamicData\n    __typename\n  }\n  userBalance {\n    ...UserBalance\n    __typename\n  }\n  rewardVault {\n    ...RewardVault\n    __typename\n  }\n  __typename\n}\n\nfragment DynamicData on GqlPoolDynamicData {\n  totalShares\n  fees24h\n  volume24h\n  swapFee\n  isInRecoveryMode\n  isPaused\n  totalLiquidity\n  aprItems {\n    apr\n    type\n    id\n    __typename\n  }\n  __typename\n}\n\nfragment UserBalance on GqlPoolUserBalance {\n  totalBalanceUsd\n  walletBalance\n  walletBalanceUsd\n  __typename\n}\n\nfragment RewardVault on GqlRewardVault {\n  dynamicData {\n    activeIncentivesValueUsd\n    apy\n    bgtCapturePercentage\n    allTimeReceivedBGTAmount\n    __typename\n  }\n  isVaultWhitelisted\n  vaultAddress\n  stakingTokenAddress\n  __typename\n}",
        chain: "BERACHAIN",
        orderBy: "totalLiquidity",
        orderDirection: "desc",
        userAddress: account
      });
      const prices = pricesRes.data.data.tokenInformations.reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr.address]: curr.usdValue
        }),
        {}
      );
      const _pools: any = [];
      const supplyCalls: any = [];
      const tokensCalls: any = [];
      shares.data.data.poolShares.forEach((item: any) => {
        const tokens = item.poolId.tokens
          .filter((token: any) => token.symbol !== item.poolId.symbol)
          .map((token: any) => {
            return {
              ...token,
              icon: TOKENS[token.address]?.icon,
              chainId: DEFAULT_CHAIN_ID
            };
          });
        _pools.push({
          id: item.poolId.id,
          address: item.poolId.address,
          liquidity: Big(item.balance).mul(1e18).toString(),
          tokens,
          symbol: item.poolId.symbol,
          tokensList: item.poolId.tokensList
        });
        supplyCalls.push({
          address: item.poolId.address,
          name: "getActualSupply"
        });
        tokensCalls.push({
          address: contracts.Vault,
          name: "getPoolTokens",
          params: [item.poolId.id]
        });
      });

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const supplyRes = await multicall({
        abi: poolAbi,
        options: {},
        calls: supplyCalls,
        multicallAddress,
        provider
      });
      const tokensRes = await multicall({
        abi: valutAbi,
        options: {},
        calls: tokensCalls,
        multicallAddress,
        provider
      });

      _pools.forEach((pool: any, i: number) => {
        const actualSupply = supplyRes[i][0]?.toString();
        const share = Big(pool.liquidity).div(actualSupply);
        const assets = tokensRes[i][0];
        const balances = tokensRes[i][1];
        let deposit = Big(0);
        pool.tokens.forEach((token: any) => {
          const j = assets.findIndex(
            (asset: any) => asset.toLowerCase() === token.address
          );
          const balance = balances[j].toString();
          token.amount = Big(balance)
            .mul(share)
            .div(10 ** token.decimals)
            .toString();
          const price = prices[token.address];
          deposit = deposit.add(Big(price || 1).mul(token.amount));
        });
        pool.shares = share.toString();
        pool.deposit = deposit.toString();
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
