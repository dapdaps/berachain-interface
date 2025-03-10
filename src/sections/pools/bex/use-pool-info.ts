import { useEffect, useState } from "react";
import bex from "@/configs/pools/bex";
import axios from "axios";

export default function usePoolInfo(id: any) {
  const [info, setInfo] = useState<any>(null);

  const queryPoolInfo = async () => {
    try {
      const res = await axios.post(
        "https://api.berachain.0xgraph.xyz/api/public/13732ec1-5d76-4134-9f2a-33cf3958a874/subgraphs/bex-subgraph/v1.0.2/gn",
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
