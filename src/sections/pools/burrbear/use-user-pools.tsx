import { useCallback, useEffect, useState } from "react";
import useAccount from "@/hooks/use-account";
import axios from "axios";
import Big from "big.js";
import burrbear from "@/configs/pools/burrbear";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { multicall, multicallAddresses } from "@/utils/multicall";
import poolAbi from "../abi/balancer-pool";
import valutAbi from "../abi/balancer-valut";
import { TOKENS } from "@/configs";

export default function useUserPools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { account, provider } = useAccount();
  const contracts = burrbear.contracts[DEFAULT_CHAIN_ID];

  const queryPools = useCallback(async () => {
    setLoading(true);

    try {
      const shares = await axios.post(burrbear.graph, {
        query: `query PoolShares{\n  poolShares(first: 1000,where: {balance_gt: 0.000001,userAddress:\"${account?.toLowerCase()}\"}){\n     poolId { id,address,symbol,tokensList,poolType,tokens{\n      address,\n      decimals,\n      symbol,\n      name\n    } } \n     balance \n  }\n}`
      });
      const _pools: any = [];
      const supplyCalls: any = [];
      const tokensCalls: any = [];
      const tokenAddresses: string[] = [];

      shares.data.data.poolShares.forEach((item: any) => {
        const tokens = item.poolId.tokens
          .filter((token: any) => token.symbol !== item.poolId.symbol)
          .map((token: any) => {
            tokenAddresses.push(token.address);
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
          tokensList: item.poolId.tokensList,
          poolType: item.poolId.poolType
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

      const pricesRes = await axios.post("https://api.berachain.com", {
        operationName: "GetCurrentTokenPrices",
        query:
          "query GetCurrentTokenPrices($chains: [GqlChain!]!, $addressIn: [String!]!) {\n  prices: tokenGetCurrentPrices(chains: $chains, addressIn: $addressIn) {\n    chain\n    price\n    address\n    updatedAt\n  }\n}\n",
        variables: {
          chains: ["BERACHAIN"],
          addressIn: tokenAddresses
        }
      });
      const prices = pricesRes.data.data.prices.reduce(
        (acc: any, curr: any) => ({
          ...acc,
          [curr.address]: curr.usdValue
        }),
        {}
      );

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
