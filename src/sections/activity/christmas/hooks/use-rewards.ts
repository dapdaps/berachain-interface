import { useEffect, useState } from "react";
import { get } from "@/utils/http";
import { NFTs } from "@/sections/activity/christmas/config";

export default function useRewards() {
  const [loading, setLoading] = useState(false);
  const [rares, setRares] = useState<any>([]);
  const [items, setItems] = useState<any>([]);

  const onQuery = async () => {
    try {
      setLoading(true);
      const res = await get("/api/mas/rewards");
      if (res.code !== 0) {
        throw Error("");
      }
      const _list = res.data.rares || [];
      _list.forEach((it: any) => {
        if (it.name === 'Jungle Party') {
          it.name = 'WeBera Finance';
        }
        it.classLogo = NFTs[it.name as string]?.icon;
      });
      setRares(_list);
      setItems(res.data.items);
    } catch (err) {
      console.log("err", err);
      setRares([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    onQuery();
  }, []);

  return {
    loading,
    rares,
    items
  };
}
