import { useEffect, useState } from "react";
import { get } from "@/utils/http";

export default function useTokenVolume() {
  const [voulmes, setVolumes] = useState<any>();
  useEffect(() => {
    const init = async () => {
      try {
        const res = await get("/api/token/market");
        setVolumes(
          res.data.data.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.symbol]: curr.volume_24h
            }),
            {}
          )
        );
      } catch (err) {
        setVolumes(undefined);
      }
    };
    init();
  }, []);

  return { voulmes };
}
