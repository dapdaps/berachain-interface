import { useEffect, useState } from "react";
import axios from "axios";
import beraswap from "@/configs/pools/beraswap";

export default function usePrices(tokens: any) {
  const [prices, setPrices] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.post(beraswap.graph, {
          query: `query{\n  tokenGetCurrentPrices(addressIn: ${JSON.stringify(
            tokens
          )},chains: [BERACHAIN]){\n    price,\n    address\n  }\n}`,
          variables: {
            swapAmount: "0.001",
            chain: "BERACHAIN",
            swapType: "EXACT_IN",
            tokenIn: "0x6969696969696969696969696969696969696969",
            tokenOut: "0x779ded0c9e1022225f8e0630b35a9b54be713736"
          }
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
    if (tokens.length) init();
  }, [tokens]);

  return prices;
}
