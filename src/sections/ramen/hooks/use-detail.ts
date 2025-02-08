import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { asyncFetch, post } from "@/utils/http";
import { TOKENS } from "../config";
import Big from "big.js";

export default function useDetail() {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [price, setPrice] = useState("");
  const [minBidPrice, setMinBidPrice] = useState("");
  const [pricePerToken, setPricePerToken] = useState("");
  const params = useParams();
  const slug = params.id as string;

  const queryDetail = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const token = TOKENS[slug];
      const detailRes = await asyncFetch(`/api.ramen/v1/project/${slug}`);
      const actionRes = await post(
        `https://api.ghostlogs.xyz/gg/pub/6b2ba56b-8866-4ea8-a8b5-0d1a70011e0b/ghostgraph`,
        {
          operationName: "GetAuctionLot",
          query:
            '\n  query GetAuctionLot(\n    $lotId: BigInt!\n    $lotIdString: String!\n    $bidder: String!\n  ) {\n    bids(\n      where: {\n        lotId: $lotId\n        bidder: $bidder\n        isRefunded: false\n        isClaimed: false\n      }\n      orderBy: "bidId"\n      orderDirection: "desc"\n    ) {\n      items {\n        amount\n        bidId\n        bidder\n        isClaimed\n        isRefunded\n        lotId\n      }\n    }\n    lotHypeMetric(id: $lotIdString) {\n      bidSubmitted\n      totalBeraDeposited\n    }\n  }\n',
          variables: {
            bidder: "0x0000000000000000000000000000000000000000",
            lotId: token.lotId,
            lotIdString: token.lotId
          }
        }
      );

      setDetail({
        ...detailRes.data,
        ...token,
        bidSubmitted: actionRes?.data?.lotHypeMetric?.bidSubmitted || 0
      });
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const queryPrice = useCallback(async () => {
    if (!slug) return;

    try {
      const priceIdRes = await asyncFetch(
        `/api.ramen/v1/project/${slug}/launch`
      );
      if (
        !priceIdRes.data.liquidity_raise_id &&
        !priceIdRes.data.price_discovery_id
      )
        return;
      const priceRes = await asyncFetch(
        `/api.ramen/v1/launch/${
          priceIdRes.data.liquidity_raise_id ||
          priceIdRes.data.price_discovery_id
        }`
      );
      setPrice(priceRes.data.detail?.ticket_price);
      setPricePerToken(priceRes.data.detail?.bera_price_per_token);
      setMinBidPrice(
        Big(priceRes.data.detail?.min_bid_price).div(1e18).toString()
      );
    } catch (err) {
      setPrice("");
      setPricePerToken("");
      setMinBidPrice("");
    }
  }, [slug]);

  useEffect(() => {
    if (!slug) return;
    queryDetail();
    queryPrice();
  }, [slug]);

  return {
    loading,
    detail,
    price,
    pricePerToken,
    minBidPrice
  };
}
