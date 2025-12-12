import { useRequest } from "ahooks";
import { get } from "@/utils/http";
import { formatTimeAgo } from "@/utils/date";
import { MarqueeCardData } from "../components/marquee";
import { getNftImgUrl } from "../config";

interface TopNftRecord {
  address: string;
  sequence: number;
  tier: number;
  bet_amount: string;
  entropy_fee: string;
  tx_hash: string;
  tx_time: number;
  end_tx_hash: string;
  reward_tx_hash: string;
  reward_type: number;
  token_address: string;
  token_amount: string;
  token_id: number;
  token_floor_price: string;
  status: number;
  multiplier: string;
}

interface TopNftResponse {
  code: number;
  data: TopNftRecord[];
}

export default function useTopNftRecords() {
  const { data, loading, runAsync: fetchData } = useRequest(
    async () => {
      const res = await get(
        "/api/go/game/gacha/records/topNft",
      ) as TopNftResponse;

      if (res.code !== 200 || !res.data) {
        return [];
      }

      const marqueeData: MarqueeCardData[] = res.data.map((record) => {
        const tokenAddressLower = record.token_address.toLowerCase();
        // const prizeName = TOKEN_NAME_MAP[tokenAddressLower] || "Unknown NFT";
        
        // const imageUrl = TOKEN_MAP[tokenAddressLower] || "/images/gacha/default-nft.png";
        const imageUrl = getNftImgUrl(tokenAddressLower, record.token_id.toString());

        
        const timeAgo = formatTimeAgo(record.tx_time * 1000);
        
        const multiplier = parseFloat(record.multiplier) || 0;

        return {
          id: `${record.sequence}-${record.tx_hash}`,
          imageUrl,
          address: record.address,
          timeAgo,
          multiplier,
          tokenAddress: record.token_address,
        };
      });

      return marqueeData;
    },
    {
      manual: false,
    }
  );

  return {
    data: data || [],
    loading,
    refresh: () => fetchData(),
  };
}
