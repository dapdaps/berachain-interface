import { useMemo, useState } from "react";
import PoolsCom from "../components/pools";
import { beraB } from "@/configs/tokens/bera-bArtio";
import Island from "./island";

export default function Pools() {
  const [version, setVersion] = useState("islands");

  const pools = useMemo(
    () =>
      version === "v3"
        ? [
            {
              token0: beraB["bera"],
              token1: beraB["honey"],
              fee: 3000,
              version: "v3"
            }
          ]
        : version === "v2"
        ? [
            {
              token0: beraB["bera"],
              token1: beraB["honey"],
              version: "v2"
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
        { label: "Islands", value: "islands", content: Island },
        { label: "V3 Pools", value: "v3" },
        { label: "V2 Pools", value: "v2" }
      ]}
    />
  );
}
