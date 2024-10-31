import axios from 'axios';
import { useEffect, useState } from 'react';
import config from '@/configs/pools/kodiak';
import { beraB } from '@/configs/tokens/bera-bArtio';

const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);

export default function usePoolsIslands() {
  const [pools, setPools] = useState<any>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const queryPools = async () => {
      try {
        const result = await axios.post(
          `https://api.goldsky.com/api/public/project_clpx84oel0al201r78jsl0r3i/subgraphs/kodiak-v3-berachain-bartio/latest/gn`,
          {
            query:
              '\n  \n  fragment TokenFields on Token {\n    id\n    symbol\n    name\n    decimals\n    totalSupply\n    volume\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    poolCount\n    totalValueLocked\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    derivedETH\n  }\n\n  \n  fragment PoolFields on Pool {\n    id\n    createdAtTimestamp\n    createdAtBlockNumber\n    feeTier\n    liquidity\n    sqrtPrice\n    feeGrowthGlobal0X128\n    feeGrowthGlobal1X128\n    token0Price\n    token1Price\n    tick\n    observationIndex\n    volumeToken0\n    volumeToken1\n    volumeUSD\n    untrackedVolumeUSD\n    feesUSD\n    txCount\n    collectedFeesToken0\n    collectedFeesToken1\n    collectedFeesUSD\n    totalValueLockedToken0\n    totalValueLockedToken1\n    totalValueLockedETH\n    totalValueLockedUSD\n    totalValueLockedUSDUntracked\n    liquidityProviderCount\n  }\n\n  query getAllIslands($allowedIds: [ID!]!) {\n    kodiakVaults(where: { id_in: $allowedIds }, orderBy: apr__averageApr) {\n      id\n      name\n      symbol\n      depositLimit\n      createdTimestamp\n      createdBlockNumber\n      totalValueLockedUSD\n      cumulativeSupplySideRevenueUSD\n      cumulativeProtocolSideRevenueUSD\n      cumulativeTotalRevenueUSD\n      inputTokenBalance\n      outputTokenSupply\n      outputTokenPriceUSD\n      pricePerShare\n      stakedOutputTokenAmount\n      rewardTokenEmissionsAmount\n      rewardTokenEmissionsUSD\n      volumeToken0\n      volumeToken1\n      volumeUSD\n      _token0Amount\n      _token1Amount\n      _token0AmountUSD\n      _token1AmountUSD\n      _token0 {\n        ...TokenFields\n      }\n      _token1 {\n        ...TokenFields\n      }\n\n      inputToken {\n        ...TokenFields\n      }\n      outputToken {\n        ...TokenFields\n      }\n      rewardTokens {\n        token {\n          ...TokenFields\n        }\n        type\n      }\n\n      fees {\n        id\n        feePercentage\n        feeType\n      }\n      pool {\n        ...PoolFields\n      }\n      apr {\n        id\n        averageApr\n        timestamp\n      }\n      dailySnapshots {\n        timestamp\n        volumeUSD\n      }\n    }\n  }\n',
            variables: {
              allowedIds: config.islands
            }
          }
        );

        setPools(
          result.data.data.kodiakVaults.map((item: any) => {
            return {
              token0: TOKENS[item._token0.id] || {
                ...item._token0,
                address: item._token0.id
              },
              token1: TOKENS[item._token1.id] || {
                ...item._token1,
                address: item._token1.id
              },
              fee: item.pool.feeTier,
              tvl: item.totalValueLockedUSD,
              volume: item.volumeUSD,
              version: item.pool.tick ? 'v3' : 'v2'
            };
          })
        );
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };
    queryPools();
  }, []);

  return { pools, loading };
}
