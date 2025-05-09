import { useMemo, useState } from "react";
import PoolsCom from "../components/pools";
import { bera } from "@/configs/tokens/bera";
import Island from "./island";

export default function Pools() {
  const [version, setVersion] = useState("islands");

  const pools = useMemo(
    () =>
      version === "v3"
        ? [
            {
              token0: bera["bera"],
              token1: bera["honey"],
              fee: 3000,
              version: "v3",
            }
          ]
        : version === "v2"
        ? [
            {
              token0: bera["bera"],
              token1: bera["honey"],
              version: "v2",
            }
          ]
        : [],
    [version]
  );
  return (
    <PoolsCom
      pools={pools}
      dex="kodiak"
      currentTab={version}
      onChangeTab={setVersion}
      tabs={[
        { label: "Top Pools", value: "islands", content: Island },
        { label: "V3 Pools", value: "v3" },
        { label: "V2 Pools", value: "v2" }
      ]}
    />
  );
}
