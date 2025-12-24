import { useEffect, useState } from "react";
import bex from "@/configs/pools/bex";
import axios from "axios";

export default function usePoolInfo(id: any) {
  const [info, setInfo] = useState<any>(null);

  const queryPoolInfo = async () => {
    try {
      const res = await axios.post(
        "https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bex-subgraph/mainnet-v1.0.1/gn",
        {
          operationName: "GetSubgraphPool",
          variables: {
            id
          },
          query:
            "query GetSubgraphPool($id: ID!) {\n  pool(id: $id) {\n    ...SubgraphPool\n    __typename\n  }\n}\n\nfragment SubgraphPool on Pool {\n  id\n  name\n  address\n  factory\n  swapFee\n  totalShares\n  totalLiquidity\n  createTime\n  owner\n  type: poolType\n  tokens {\n    address\n    name\n    decimals\n    symbol\n    index\n    weight\n    balance\n    __typename\n  }\n  __typename\n}"
        }
      );

      setInfo(res.data.data.pool);
    } catch (err) {
      setInfo(null);
    }
  };

  useEffect(() => {
    if (id) queryPoolInfo();
  }, [id]);

  return { info };
}
