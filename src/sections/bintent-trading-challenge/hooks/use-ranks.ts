import useCustomAccount from "@/hooks/use-account";
import { IRank, TCategory } from "@/types";
import { get } from '@/utils/http';
import { useEffect, useState } from 'react';

export default function useRanks(category: TCategory) {
  const { account } = useCustomAccount()
  const [ranks, setRanks] = useState<IRank[]>([]);
  const [loading, setLoading] = useState(false);

  async function queryRanks() {
    try {
      setLoading(true)
      const response = await get("/api/bintent/rank/" + category)
      if (response.code === 0) {
        setRanks(response.data)
      }
    } catch (error) {
      throw new Error(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    category && queryRanks();
  }, [category]);

  return {
    loading,
    ranks,
  };
};