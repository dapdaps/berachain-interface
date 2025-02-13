import axios from "axios";
import { useEffect, useState } from "react";
import config from "@/configs/pools/kodiak";
import { tickToPrice } from "../tick-math";
import { balanceFormated } from "@/utils/balance";
import { useKodiakTokensStore } from "@/stores/kodiak-tokens";

export default function usePoolsIslands() {
  const [pools, setPools] = useState<any>();
  const [loading, setLoading] = useState(true);
  const kodiakTokensStore: any = useKodiakTokensStore();

  useEffect(() => {
    const queryPools = async () => {
      try {
        const calls = [
          axios.post(
            `https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v3-berachain-mainnet/latest/gn`,
            {
              query:
                "\n  \n  fragment TokenFields on Token {\n    id\n    symbol\n    name\n    decimals\n    totalSupply\n    volume\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    poolCount\n    totalValueLocked\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    derivedETH\n  }\n\n  \n  fragment PoolFields on Pool {\n    id\n    createdAtTimestamp\n    createdAtBlockNumber\n    feeTier\n    liquidity\n    sqrtPrice\n    feeGrowthGlobal0X128\n    feeGrowthGlobal1X128\n    token0Price\n    token1Price\n    tick\n    observationIndex\n    volumeToken0\n    volumeToken1\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    collectedFeesToken0\n    collectedFeesToken1\n    collectedFeesUSD\n    totalValueLockedToken0\n    totalValueLockedToken1\n    totalValueLockedETH\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    liquidityProviderCount\n  }\n\n  query getAllIslands($where: KodiakVault_filter!, $orderBy: KodiakVault_orderBy, $orderDirection: OrderDirection) {\n    kodiakVaults(where: $where, orderBy: $orderBy, orderDirection: $orderDirection) {\n      id\n      name\n      symbol\n      depositLimit\n      createdTimestamp\n      createdBlockNumber\n      totalValueLockedUSD\n      cumulativeSupplySideRevenueUSD\n      cumulativeProtocolSideRevenueUSD\n      cumulativeTotalRevenueUSD\n      inputTokenBalance\n      outputTokenSupply\n      outputTokenPriceUSD\n      pricePerShare\n      stakedOutputTokenAmount\n      rewardTokenEmissionsAmount\n      rewardTokenEmissionsUSD\n      volumeToken0\n      volumeToken1\n      volumeUSD\n      weeklyVolumeUSD\n      weeklyFeesEarnedUSD\n      lowerTick\n      upperTick\n      _token0Amount\n      _token1Amount\n      _token0AmountUSD\n      _token1AmountUSD\n      _token0 {\n        ...TokenFields\n      }\n      _token1 {\n        ...TokenFields\n      }\n\n      inputToken {\n        ...TokenFields\n      }\n      outputToken {\n        ...TokenFields\n      }\n      rewardTokens {\n        token {\n          ...TokenFields\n        }\n        type\n      }\n\n      fees {\n        id\n        feePercentage\n        feeType\n      }\n      pool {\n        ...PoolFields\n      }\n      apr {\n        id\n        averageApr\n        timestamp\n      }\n      dailySnapshots {\n        timestamp\n        volumeUSD\n      }\n    }\n  }\n",
              variables: {
                orderBy: "totalValueLockedUSD",
                orderDirection: "desc",
                where: {
                  id_in: Object.keys(config.sweetenedIslands),
                  implementation_contains: "0x"
                }
              }
            }
          ),
          axios.post(
            `https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v3-berachain-mainnet/latest/gn`,
            {
              query:
                "\n  \n  fragment TokenFields on Token {\n    id\n    symbol\n    name\n    decimals\n    totalSupply\n    volume\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    poolCount\n    totalValueLocked\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    derivedETH\n  }\n\n  \n  fragment PoolFields on Pool {\n    id\n    createdAtTimestamp\n    createdAtBlockNumber\n    feeTier\n    liquidity\n    sqrtPrice\n    feeGrowthGlobal0X128\n    feeGrowthGlobal1X128\n    token0Price\n    token1Price\n    tick\n    observationIndex\n    volumeToken0\n    volumeToken1\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    collectedFeesToken0\n    collectedFeesToken1\n    collectedFeesUSD\n    totalValueLockedToken0\n    totalValueLockedToken1\n    totalValueLockedETH\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    liquidityProviderCount\n  }\n\n  query getAllIslands($allowedIds: [ID!]!) {\n    kodiakVaults(where: { id_in: $allowedIds }, orderBy: apr__averageApr) {\n      id\n      name\n      symbol\n      depositLimit\n      createdTimestamp\n      createdBlockNumber\n      totalValueLockedUSD\n      cumulativeSupplySideRevenueUSD\n      cumulativeProtocolSideRevenueUSD\n      cumulativeTotalRevenueUSD\n      inputTokenBalance\n      outputTokenSupply\n      outputTokenPriceUSD\n      pricePerShare\n      stakedOutputTokenAmount\n      rewardTokenEmissionsAmount\n      rewardTokenEmissionsUSD\n      volumeToken0\n      volumeToken1\n      volumeUSD\n      _token0Amount\n      _token1Amount\n      _token0AmountUSD\n      _token1AmountUSD\n      _token0 {\n        ...TokenFields\n      }\n      _token1 {\n        ...TokenFields\n      }\n\n      inputToken {\n        ...TokenFields\n      }\n      outputToken {\n        ...TokenFields\n      }\n      rewardTokens {\n        token {\n          ...TokenFields\n        }\n        type\n      }\n\n      fees {\n        id\n        feePercentage\n        feeType\n      }\n      pool {\n        ...PoolFields\n      }\n      apr {\n        id\n        averageApr\n        timestamp\n      }\n      dailySnapshots {\n        timestamp\n        volumeUSD\n      }\n  upperTick\n lowerTick\n }\n  }\n",
              variables: {
                allowedIds: config.islands
              }
            }
          )
        ];
        if (Object.values(kodiakTokensStore.tokens).length === 0) {
          calls.push(
            axios.get("https://api.panda.kodiak.finance/80094/tokenList.json")
          );
          calls.push(
            axios.get(
              "https://static.kodiak.finance/tokenLists/berachain_mainnet.json"
            )
          );
        }
        const [sweetenedResult, result, pandaResponse, normalResponse] =
          await Promise.all(calls);

        let tokens: any = kodiakTokensStore.tokens;
        if (pandaResponse && normalResponse) {
          const _tokens = [
            ...pandaResponse.data.tokens,
            ...normalResponse.data.tokens
          ].map((token: any) => ({
            ...token,
            icon: token.logoURI
          }));
          tokens = _tokens.reduce(
            (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
            {}
          );
          kodiakTokensStore.set({
            tokens
          });
          console.log(58, tokens);
        }
        const list = [
          ...(sweetenedResult.data.data.kodiakVaults || []),
          ...(result.data.data.kodiakVaults || [])
        ];

        setPools(
          list.map((item: any) => {
            const _token0 = tokens[item._token0.id.toLowerCase()] || {
              ...item._token0,
              address: item._token0.id
            };
            const _token1 = tokens[item._token1.id.toLowerCase()] || {
              ...item._token1,
              address: item._token1.id
            };

            const lowerPrice =
              item.lowerPrice < -887000
                ? "0"
                : balanceFormated(
                    tickToPrice({
                      tick: item.lowerTick,
                      token0: _token0,
                      token1: _token1
                    }),
                    2
                  );
            const upperPrice =
              item.upperTick > 887000
                ? "∞"
                : balanceFormated(
                    tickToPrice({
                      tick: item.upperTick,
                      token0: _token0,
                      token1: _token1
                    }),
                    2
                  );
            return {
              token0: {
                ..._token0,
                price: item.pool.token0Price,
                icon: _token0.icon || "/assets/tokens/default_icon.png"
              },
              token1: {
                ..._token1,
                price: item.pool.token1Price,
                icon: _token1.icon || "/assets/tokens/default_icon.png"
              },
              fee: item.pool.feeTier,
              tvl: item.totalValueLockedUSD,
              volume: item.volumeUSD,
              version: item.pool.tick ? "v3" : "v2",
              apr: item.apr.averageApr,
              lowerPrice,
              upperPrice,
              id: item.id,
              farmAddress: (config.sweetenedIslands as any)[item.id]
                ?.farmAddress,
              pool: {
                lowerTick: item.lowerTick,
                upperTick: item.upperTick,
                tick: item.pool.tick
              },
              symbol: item.symbol,
              icon: "/assets/tokens/kodiak.png",
              price: item.outputTokenPriceUSD,
              router: config.stakingRouter
            };
          })
        );
      } catch (err) {
        console.log(128, err);
      } finally {
        setLoading(false);
      }
    };
    queryPools();
  }, []);

  return { pools, loading };
}
