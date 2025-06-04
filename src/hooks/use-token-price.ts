import { useCallback, useState } from "react";

import { usePriceStore } from "@/stores/usePriceStore";
import * as http from "@/utils/http";

const DELAY = 1000 * 60 * 5;
export default function () {
  const setPriceStore = usePriceStore((store: any) => store.set);
  const [pending, setPending] = useState(false);
  const initializePrice = useCallback(async () => {
    console.log("======11111========")
    if (pending) return;
    setPending(true);
    let beraTownPrice: any = {};
    try {
      const beraTownPriceRes = await http.get(
        `${process.env.NEXT_PUBLIC_API}/api/token/price`
      );
      if (beraTownPriceRes.code === 0) {
        beraTownPrice = beraTownPriceRes.data;
      }
    } catch (err: any) {
      console.log('get beratown price failed: %o', err);
    }

    try {
      const res = await http.get(
        "https://api.dapdap.net/get-token-price-by-dapdap"
      );
      setPriceStore({
        price: res.data || {},
        beraTownPrice,
      });
      setTimeout(() => {
        initializePrice();
      }, DELAY);
      setPending(false);
    } catch (err) {
      setPending(false);
    }
  }, [pending]);

  return { initializePrice };
}
