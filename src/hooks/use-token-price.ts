import { useCallback, useState } from "react";

import { usePriceStore } from "@/stores/usePriceStore";
import * as http from "@/utils/http";

const DELAY = 1000 * 60 * 5;
export default function () {
  const setPriceStore = usePriceStore((store: any) => store.set);
  const [pending, setPending] = useState(false);
  const initializePrice = useCallback(async () => {
    if (pending) return;
    setPending(true);
    try {
      const beraTownPriceRes = await http.get(
        `${process.env.NEXT_PUBLIC_API}/api/token/price`
      );
      setPriceStore({
        price: beraTownPriceRes.data || {},
        beraTownPrice: beraTownPriceRes.data,
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
