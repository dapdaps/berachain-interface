import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { asyncFetch } from "@/utils/http";

export default function useDetail() {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<any>();
  const [price, setPrice] = useState(0);
  const [minBidPrice, setMinBidPrice] = useState(0);
  const [pricePerToken, setPricePerToken] = useState(0);
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");

  const queryDetail = useCallback(async () => {
    setLoading(true);
    try {
      const detailRes = await asyncFetch(`/api.ramen/v1/project/${slug}`);
      setDetail(detailRes.data);
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
      const priceRes = await asyncFetch(
        `/api.ramen/v1/launch/${priceIdRes.data.liquidity_raise_id}`
      );
      setPrice(priceRes.data.detail?.ticket_price);
      setPricePerToken(priceRes.data.detail?.bera_price_per_token);
      setMinBidPrice(priceRes.data.detail?.min_bid_price);
    } catch (err) {
      setPrice(0);
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
