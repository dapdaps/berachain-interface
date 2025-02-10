import { useEffect, useState } from "react";
import axios from "axios";
import beraswap from "@/configs/pools/beraswap";

export default function usePrices() {
  const [prices, setPrices] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.post(beraswap.graph, {
          operationName: "GetTokenInformations",
          query:
            'query GetTokenInformations {\n  tokenInformations(where: {usdValue_gt: "0"}) {\n    address\n    usdValue\n  }\n}\n'
        });
        const _p = response.data.data.tokenInformations;
        setPrices(
          _p.reduce(
            (acc: any, curr: any) => ({
              ...acc,
              [curr.address]: curr.usdValue
            }),
            {}
          )
        );
      } catch (err) {}
    };
    init();
  }, []);

  return prices;
}
