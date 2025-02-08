import { useMemo, useState } from "react";
import Com from "../components/yours";
import kodiak from "@/configs/pools/kodiak";
import usePoolsV2 from "./use-pools-v2";
import usePoolsV3 from "../hooks/use-pools-v3";
import Island from "./island/yours";

export default function Yours() {
  const [version, setVersion] = useState("islands");
  const {
    pools: v2Pools,
    loading: v2Loading,
    queryPools: queryV2Pools
  } = usePoolsV2(false);
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
      tabs={[
        { label: "Islands", value: "islands", content: Island },
        { label: "V3 Pools", value: "v3" },
        { label: "V2 Pools", value: "v2" }
      ]}
    />
  );
}
