import { useCallback, useEffect, useState } from "react";
import { get } from "@/utils/http";
import useData from "./use-data";

const PAGE_SIZE = 10;
export default function useRank(token?: string) {
  const [list, setList] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const { currentRound } = useData();

  const onQuery = useCallback(
    async (p: number) => {
      try {
        setLoading(true);
        const result = await get(
          `/api/meme/leaderboard${token ? "/" + token : ""}?round=${
            currentRound.round
          }&page=${p}&page_size=${PAGE_SIZE}`
        );
        setList(
          result.data.data.map((item: any, i: number) => ({
            ...item,
            rank: (p - 1) * PAGE_SIZE + 1 + i
          }))
        );
        setTotalPage(result.data.total_page);
      } catch (err) {
        console.log(err);
        setList([]);
        setPage(1);
        setTotalPage(1);
      } finally {
        setLoading(false);
      }
    },
    [list, token]
  );

  const onChangePage = (p: number) => {
    if (p > totalPage && p !== 1) return;
    onQuery(p);
    setPage(p);
  };

  useEffect(() => {
    onChangePage(1);
  }, [token]);

  return { loading, list, totalPage, page, onChangePage };
}
