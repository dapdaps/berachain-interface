import { useEffect, useState, useMemo } from "react";
import { bera } from "@/configs/tokens/bera";
import kodiak from "@/configs/pools/kodiak";
import { wrapNativeToken } from "@/sections/pools/utils";
import { default as useBexPools } from "@/sections/pools/bex/use-pools";
import { default as useKodiakV2Pools } from "@/sections/pools/kodiak/use-pools-v2";
import { default as usePoolsV3 } from "@/sections/pools/hooks/use-pools-v3";
import usePoolsIslands from "@/sections/pools/kodiak/use-pools-islands";
import useUserPools from "@/sections/pools/bex/use-user-pools";
import useUserList from "@/sections/pools/kodiak/island/hooks/use-user-list";
import Big from "big.js";
export default function usePools(refresher: number) {
  // const [pools, setPools] = useState<any>([]);
  // const [loading, setLoading] = useState(false);
  const { pools: bexPools, loading: bexLoading } = useBexPools();
  const { pools: userBexPools, loading: userBexLoading } = useUserPools()

  const { loading: kodiakIslandsLoading, pools: kodiakIslands } = usePoolsIslands();
  const { loading: userKodiakIslandsLoading, list: userKodiakIslands } = useUserList();


  const { pools: userKodiakV2Pools, loading: userKodiakV2Loading } = useKodiakV2Pools(
    false,
    refresher
  );
  const {
    pools: userKodiakV3Pools,
    loading: userKodiakV3Loading,
    ticksInfo: kodiakTicksInfo
  } = usePoolsV3({ dex: kodiak, refresher });

  const kodiakV2Loading = false
  const kodiakV3Loading = false
  const kodiakV2Pools = [{
    token0: {
      ...bera["bera"],
      address: "0x6969696969696969696969696969696969696969",
    },
    token1: bera["honey"],
    protocol: "Kodiak",
    version: "v2",
  }]
  const kodiakV3Pools = [{
    token0: {
      ...bera["bera"],
      address: "0x6969696969696969696969696969696969696969",
    },
    token1: bera["honey"],
    fee: 3000,
    protocol: "Kodiak",
    version: "v3",
  }]
  const {
    loading,
    pools,
  } = useMemo(() => {
    return {
      loading: kodiakIslandsLoading || bexLoading ||
        userKodiakIslandsLoading || userKodiakV2Loading || userKodiakV3Loading,
      pools: [
        ...(bexPools ? bexPools : []).map(item => {
          return {
            ...item,
            token0: item?.tokens[0],
            token1: item?.tokens[1],
            protocol: "bex",
            type: "bex",
            // fee: item?.fees24h,
            volume: item?.volume24h,
            symbol: "BEX " + item?.symbol?.split("|").map(str => str.trim()).join("-"),
            protocolIcon: "/images/dapps/bex.svg"
          }
        }),
        ...(kodiakIslands ? kodiakIslands : []).map(item => {
          return {
            ...item,
            protocolIcon: "/images/dapps/kodiak.svg",
            protocol: "Kodiak",
            version: "island",
          }
        }),
        ...kodiakV2Pools,
        ...kodiakV3Pools
      ].filter(pool => Big(pool?.tvl ?? 0).gt(100))
        .sort((prev, next) => Big(next["apr"] || 0).gt(prev["apr"] || 0) ? 1 : -1)
    }
  }, [kodiakIslands, bexPools, bexLoading, kodiakIslandsLoading, userKodiakIslandsLoading, userKodiakV2Loading, userKodiakV3Loading])


  const bexBalances = useMemo(() => {
    if (userBexPools.length === 0 || pools.length === 0) return {};
    const _pools = {

    }
    userBexPools?.forEach((pool: any) => {
      const [token0, token1] = pool?.tokens ?? []
      const key = `${token0.address.toLowerCase()}-${token1.address.toLowerCase()}`
      const values = _pools[key]
      _pools[key] = values ? values : []
      _pools[key].push(pool)
    })
    return _pools;
  }, [userBexPools, pools]);

  const kodiakIslandsBalances = useMemo(() => {
    if (userKodiakIslands.length === 0 || pools.length === 0) return {};
    const _pools: any = {};
    userKodiakIslands.forEach((island: any) => {
      const key =
        island?.pool.token0.address.toLowerCase() +
        "-" +
        island?.pool.token1.address.toLowerCase() +
        "-" +
        island?.pool.fee;
      if (_pools[key]) {
        _pools[key].push(island?.pool);
      } else {
        _pools[key] = [island?.pool];
      }
    });
    return _pools;
  }, [userKodiakIslands, pools]);

  const kodiakV2Balances = useMemo(() => {
    if (userKodiakV2Pools.length === 0 || pools.length === 0) return {};
    const _pools: any = {};
    userKodiakV2Pools?.forEach((pool: any) => {
      const key =
        pool.token0.address.toLowerCase() +
        "-" +
        pool.token1.address.toLowerCase()
      if (_pools[key]) {
        _pools[key].push(pool);
      } else {
        _pools[key] = [pool];
      }
    });
    return _pools;
  }, [userKodiakV2Pools, pools]);
  const kodiakV3Balances = useMemo(() => {
    if (userKodiakV3Pools.length === 0 || pools.length === 0) return {};
    const _pools: any = {};
    userKodiakV3Pools?.forEach((pool: any) => {
      const key =
        pool.token0.address.toLowerCase() +
        "-" +
        pool.token1.address.toLowerCase() +
        "-" +
        pool.fee;
      if (_pools[key]) {
        _pools[key].push(pool);
      } else {
        _pools[key] = [pool];
      }
    });
    return _pools;
  }, [userKodiakV3Pools, pools]);


  console.log('=====kodiakV2Balances====', kodiakV2Balances)
  return {
    pools,
    loading,
    bexLoading,
    bexBalances,
    kodiakV2Loading,
    kodiakV2Balances,
    kodiakV3Loading,
    kodiakV3Balances,
    kodiakTicksInfo,
    kodiakIslandsBalances
  };
}
