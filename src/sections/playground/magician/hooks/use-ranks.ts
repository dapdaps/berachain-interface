import { get } from '@/utils/http';
import { useEffect, useState } from 'react';
import { useAccount } from "wagmi";

export default function useRanks({ weekTime }: { weekTime: string }) {
  const [ranks, setRanks] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();

  async function queryRanks() {
    if (!address || loading) return;

    try {
      setLoading(true)
      const response = await get("/api/go/game/rps/leaderboard/week?address=" + address + '&week_time=' + weekTime)
      if (response.code === 200) {
        setRanks(response.data)
      }
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    address && queryRanks();
  }, [address, weekTime]);

  return {
    loading,
    ranks,
  };
};