import { useEffect, useState, useMemo } from "react";
import { bera } from "@/configs/tokens/bera";
import kodiak from "@/configs/pools/kodiak";
import { wrapNativeToken } from "@/sections/pools/utils";
import { default as useBexPools } from "@/sections/pools/bex/use-pools";
import { default as useKodiakV2Pools } from "@/sections/pools/kodiak/use-pools-v2";
import { default as usePoolsV3 } from "@/sections/pools/hooks/use-pools-v3";
import usePoolsIslands from "@/sections/pools/kodiak/use-pools-islands";

export default function usePools(refresher: number) {
  // const [pools, setPools] = useState<any>([]);
  // const [loading, setLoading] = useState(false);
  const { pools: bexPools, loading: bexLoading } = useBexPools();
  const { pools: kodiakV2Pools, loading: kodiakV2Loading } = useKodiakV2Pools(
    true,
    refresher
  );
  const {
    pools: kodiakV3Pools,
    loading: kodiakV3Loading,
    ticksInfo: kodiakTicksInfo
  } = usePoolsV3({ dex: kodiak, refresher });

  const { loading: islandsLoading, pools: islands } = usePoolsIslands();

  const {
    loading,
    pools,
  } = useMemo(() => {
    return {
      loading: islandsLoading,
      pools: [
        ...(islands ? islands : []).map(item => {
          return {
            ...item,
            protocolIcon: "/images/dapps/kodiak.svg",
            protocol: "Kodiak",
            type: "Island"
          }
        }),
        {
          token0: wrapNativeToken(bera["bera"]),
          token1: bera["honey"],
          protocolIcon: "/images/dapps/kodiak.svg",
          protocol: "Kodiak",
          version: "v2",
          id: 2,
          type: "v2"
        },
        {
          token0: wrapNativeToken(bera["bera"]),
          token1: bera["honey"],
          protocolIcon: "/images/dapps/kodiak.svg",
          protocol: "Kodiak",
          version: "v3",
          fee: 3000,
          id: 3,
          type: "v3"
        },
      ]
    }
  }, [islands, islandsLoading])


  const bexBalances = useMemo(() => {
    if (bexPools.length === 0 || pools.length === 0) return {};
    return bexPools;
  }, [bexPools, pools]);

  const kodiakV2Balances = useMemo(() => {
    if (kodiakV2Pools.length === 0 || pools.length === 0) return {};
    return kodiakV2Pools;
  }, [kodiakV2Pools, pools]);
  const kodiakV3Balances = useMemo(() => {
    if (kodiakV3Pools.length === 0 || pools.length === 0) return {};
    const _pools: any = {};
    kodiakV3Pools.forEach((pool: any) => {
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
  }, [kodiakV3Pools, pools]);

  return {
    pools,
    loading,
    bexLoading,
    bexBalances,
    kodiakV2Loading,
    kodiakV2Balances,
    kodiakV3Loading,
    kodiakV3Balances,
    kodiakTicksInfo
  };
}
