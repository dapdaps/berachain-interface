import { useCallback, useState } from "react";
import { get } from "@/utils/http";

const PAGE_SIZE = 10;

export default function useVoteTokens(round: number) {
  const [tokens, setTokens] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);

  const onQuery = useCallback(async (p: number) => {
    try {
      setLoading(true);
      const result = await get(
        `/api/meme/voteTokens?round=${round}&page=${p}&page_size=${PAGE_SIZE}`
      );
      setTokens(
        result.data.data.map((token: any, i: number) => ({
          ...token,
          sn: (p - 1) * PAGE_SIZE + i + 1
        }))
      );
      setTotalPage(result.data.total_page);
    } catch (err) {
      console.log(err);
      setPage(1);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const onChangePage = (p: number) => {
    if (p > totalPage) return;
    onQuery(p);
    setPage(p);
  };

  return { loading, tokens, totalPage, page, onChangePage };
}
