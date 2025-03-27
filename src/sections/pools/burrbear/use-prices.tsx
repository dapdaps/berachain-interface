import { useEffect, useState } from "react";
import axios from "axios";

export default function usePrices(tokens: any) {
  const [prices, setPrices] = useState<any>({});

  useEffect(() => {
    const init = async () => {
      try {
        const response = await axios.post("https://api.berachain.com", {
          operationName: "GetCurrentTokenPrices",
          query:
            "query GetCurrentTokenPrices($chains: [GqlChain!]!, $addressIn: [String!]!) {\n  prices: tokenGetCurrentPrices(chains: $chains, addressIn: $addressIn) {\n    chain\n    price\n    address\n    updatedAt\n  }\n}\n",
          variables: {
            chains: ["BERACHAIN"],
            addressIn: tokens.map((t: any) => t.address)
          }
        });
        const _p = response.data.data.prices;
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
