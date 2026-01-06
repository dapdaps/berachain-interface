import { useRequest, useThrottleFn } from "ahooks";
import { get } from "@/utils/http";
import { useEffect, useState } from "react";
import useUser from "@/hooks/use-user";

interface GachaRecord {
  address: string;
  bet_amount: number;
  end_tx_hash: string;
  entropy_fee: number;
  reward_tx_hash: string;
  reward_type: number;
  sequence: number;
  status: number;
  tier: number;
  token_address: string;
  token_amount: number;
  token_id: number;
  tx_hash: string;
  tx_time: number;
}

interface GachaRecordsResponse {
  code: number;
  data: {
    data: GachaRecord[];
    total: number;
    total_page: number;
  };
}

interface UseHistoryParams {
  page?: number;
  pageSize?: number;
}

export default function useHistory(params?: UseHistoryParams) {
  const [page, setPage] = useState(params?.page || 1);
  const [pageSize] = useState(params?.pageSize || 10);
  const [totalPage, setTotalPage] = useState(0);
  const [total, setTotal] = useState(0);
  const { userInfo } = useUser();

  const fetchHistory = async () => {
    if (!userInfo?.address) {
      return [];
    }

    const res = await get("/api/go/game/gacha/records", {
      page: page,
      page_size: pageSize,
    }) as GachaRecordsResponse;

    if (res.code !== 200) {
      setTotalPage(0);
      setTotal(0);
      return [];
    }

    setTotalPage(res.data.total_page || 0);
    setTotal(res.data.total || 0);
    return res.data.data || [];
  };

  const { run: throttledFetchHistory } = useThrottleFn(
    fetchHistory,
    {
      wait: 500,
    }
  );

  const { data, loading, runAsync: getHistory } = useRequest(
    () => throttledFetchHistory(),
    {
      refreshDeps: [page, pageSize, userInfo?.address],
    }
  );

  return {
    data: data || [],
    loading,
    page,
    pageSize,
    totalPage,
    total,
    setPage,
    refresh: () => getHistory(),
  };
}
