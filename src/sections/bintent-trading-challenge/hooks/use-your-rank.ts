import { IYourRank, TCategory } from "@/types";
import { get } from '@/utils/http';
import { useEffect, useState } from 'react';
import useAccount from "./use-account";
import useNearWallet from "./use-near-wallet";


export default function useYourRank(category: TCategory) {
  const { account } = useNearWallet()
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
    account && category && queryYourRank()
  }, [category, account])


  return {
    loading,
    yourRank,
  };
};