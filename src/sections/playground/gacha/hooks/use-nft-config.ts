import { useState, useEffect } from "react";
import { useRequest } from "ahooks";
import { get } from "@/utils/http";

export interface NftRewardItem {
  address: string;
  total: number;
  icon: string;
  name: string;
  floor_price: string;
}

interface NftRewardResponse {
  code: number;
  data: NftRewardItem[];
}

export default function useNftConfig() {
  const [tokenMap, setTokenMap] = useState<Record<string, string>>({
    '0x0000000000000000000000000000000000000000': "/assets/tokens/bera.svg",
  });
  const [tokenNameMap, setTokenNameMap] = useState<Record<string, string>>({
    '0x0000000000000000000000000000000000000000': "BERA",
  });

  const { data, loading, error } = useRequest(
    async (): Promise<NftRewardItem[]> => {
      const res = await get("/api/go/game/gacha/reward/nft") as NftRewardResponse;
      if (res.code !== 200) {
        return [];
      }
      return res.data;
    },
    {
      manual: false
    }
  );

  useEffect(() => {
    if (data && data.length > 0) {
      const newTokenMap: Record<string, string> = {
        '0x0000000000000000000000000000000000000000': "/assets/tokens/bera.svg",
      };
      const newTokenNameMap: Record<string, string> = {
        '0x0000000000000000000000000000000000000000': "BERA",
      };

      data.forEach((nft) => {
        const address = nft.address.toLowerCase();
        newTokenMap[address] = nft.icon;
        newTokenNameMap[address] = nft.name;
      });

      setTokenMap(newTokenMap);
      setTokenNameMap(newTokenNameMap);
    }
  }, [data]);

  return {
    nftConfig: data || [],
    tokenMap,
    tokenNameMap,
    loading,
    error
  };
}
