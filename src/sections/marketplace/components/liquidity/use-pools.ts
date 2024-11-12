import { useEffect, useState, useMemo } from "react";
import { beraB } from "@/configs/tokens/bera-bArtio";
import kodiak from "@/configs/pools/kodiak";
import { wrapNativeToken } from "@/sections/pools/utils";
import { default as useBexPools } from "@/sections/pools/bex/use-pools";
import { default as useKodiakV2Pools } from "@/sections/pools/kodiak/use-pools-v2";
import { default as usePoolsV3 } from "@/sections/pools/hooks/use-pools-v3";

export default function usePools() {
  const [pools, setPools] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { pools: bexPools, loading: bexLoading } = useBexPools(true);
  const { pools: kodiakV2Pools, loading: kodiakV2Loading } =
    useKodiakV2Pools(true);
  const {
    pools: kodiakV3Pools,
    loading: kodiakV3Loading,
    ticksInfo: kodiakTicksInfo
  } = usePoolsV3({ dex: kodiak });

  const query = async () => {
    setPools([
      {
        token0: wrapNativeToken(beraB["bera"]),
        token1: beraB["honey"],
        protocolIcon: "/images/dapps/bex.png",
        protocol: "BEX",
        id: 1
      },
      {
        token0: wrapNativeToken(beraB["bera"]),
        token1: beraB["honey"],
        protocolIcon: "/images/dapps/kodiak.svg",
        protocol: "Kodiak",
        version: "v2",
        id: 2
      },
      {
        token0: wrapNativeToken(beraB["bera"]),
        token1: beraB["honey"],
        protocolIcon: "/images/dapps/kodiak.svg",
        protocol: "Kodiak",
        version: "v3",
        fee: 3000,
        id: 3
      }
    ]);
  };

  useEffect(() => {
    query();
  }, []);

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
