import useCustomAccount from "@/hooks/use-account";
import { useState, useEffect } from 'react';
import { get, post } from '@/utils/http';
import { IYourRank, TCategory } from "@/types";


export default function useYourRank(category: TCategory) {
  const { account } = useCustomAccount()
  const [yourRank, setYourRank] = useState<IYourRank>();
  const [loading, setLoading] = useState(false)

  async function queryYourRank() {
    try {
      setLoading(true)
      const response = await get("/api/bintent/rank/" + category + "/" + account)
      if (response.code === 0) {
        setYourRank(response.data)
      }
    } catch (error) {
      throw new Error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    account && queryYourRank()
  }, [category, account])
  return {
    loading,
    yourRank,
  };
};