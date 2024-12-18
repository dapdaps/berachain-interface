import { useEffect, useState } from "react";
import axios from "axios";

export default function usePrices() {
  const [prices, setPrices] = useState({});

  useEffect(() => {
    const init = async () => {
      const response = await axios.post(
        "https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bgt-subgraph/v1000000/gn",
        {
          operationName: "GetTokenInformations",
          query:
            'query GetTokenInformations {\n  tokenInformations(where: {usdValue_gt: "0"}) {\n    address\n    usdValue\n  }\n}\n'
        }
      );
      setPrices(response.data);
    };
    init();
  }, []);

  return prices;
}
