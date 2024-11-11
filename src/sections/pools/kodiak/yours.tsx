import { useMemo, useState } from "react";
import Com from "../components/yours";
import kodiak from "@/configs/pools/kodiak";
import usePoolsV2 from "./use-pools-v2";
import usePoolsV3 from "../hooks/use-pools-v3";

export default function Yours() {
  const [version, setVersion] = useState("v3");
  const {
    pools: v2Pools,
    loading: v2Loading,
    queryPools: queryV2Pools
  } = usePoolsV2();
  const {
    pools: v3Pools,
    loading: v3Loading,
    ticksInfo,
    queryPools: queryV3Pools
  } = usePoolsV3({ dex: kodiak });

  const pools = useMemo(
    () => (version === "v3" ? v3Pools : v2Pools),
    [version, v3Pools, v2Pools]
  );

  return (
    <Com
      pools={pools}
      dex="kodiak"
      loading={version === "v3" ? v3Loading : v2Loading}
      ticksInfo={ticksInfo}
      currentTab={version}
      onChangeTab={setVersion}
      onSuccess={() => {
        setTimeout(() => {
          version === "v3" ? queryV2Pools() : queryV3Pools();
        }, 2000);
      }}
    />
  );
}
