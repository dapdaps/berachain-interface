import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { asyncFetch } from "@/utils/http";

export default function useUserInfo(price: number) {
  const [maxTicket, setMaxTicket] = useState(0);
  const { account } = useCustomAccount();
  const queryGachaBalance = useCallback(async () => {
    const gachaRes = await asyncFetch(
      `/api.ramen/v1/rewards?address=${account}`
    );
    const gachaBalance = gachaRes.data.amount;
    setMaxTicket(Math.floor(gachaBalance / price));
  }, [account, price]);

  useEffect(() => {
    if (!account || !price) return;
    queryGachaBalance();
  }, [account, price]);

  return {
    maxTicket
  };
}
