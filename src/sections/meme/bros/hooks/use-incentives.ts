import { useCallback, useEffect, useState } from "react";
import { get } from "@/utils/http";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useIncentives(contract: string) {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const onQuery = useCallback(
    async (p: number) => {
      try {
        setLoading(true);
        const result = await get(`/db3`, {
          url: "api/transaction/list",
          params: JSON.stringify({
            limit: 20,
            start_time: p === 1 ? "" : list.slice(-1)[0].tx_time,
            chain_id: DEFAULT_CHAIN_ID,
            dapp: "supermemebros",
            sub_type: "deposit_reward",
            contract
          })
        });
        setList(result.data.list);
        if (result.data.has_more) {
          setTotalPage(p + 1);
        }
      } catch (err) {
        console.log(err);
        setList([]);
        setPage(1);
        setTotalPage(1);
      } finally {
        setLoading(false);
      }
    },
    [list, contract]
  );

  const onChangePage = (p: number) => {
    if (p > totalPage) return;
    onQuery(p);
    setPage(p);
  };

  return { loading, list, totalPage, page, onChangePage };
}
