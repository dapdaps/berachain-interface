import { useEffect, useState } from "react";
import useCustomAccount from "./use-account";
import { get } from "@/utils/http";

export const baseUrl = new URL(`${process.env.NEXT_PUBLIC_API}/api/infrared`); // WARN：Only accessible in the dev environment for the US region

export default function useUserPoints() {
  const { account } = useCustomAccount()
  const [loading, setLoading] = useState(false)
  const [userHistoryPoints, setUserHistoryPoints] = useState()
  const [userHistoryLoading, setUserHistoryLoading] = useState(false)
  const [userPoints, setUserPoints] = useState()
  async function getUserPoints() {
    try {
      setLoading(true);
      baseUrl.searchParams.append("path", `api/points/user/${account}`);
      baseUrl.searchParams.append("params", "chainId=80094");
      const result = await get(baseUrl.toString());
      setUserPoints(result);
    } catch (error) {
      console.error("Failed to fetch user points:", error);
    } finally {
      setLoading(false);
    }
  }


  async function getUserHistoryPoints() {
    try {
      setUserHistoryLoading(true);
      baseUrl.searchParams.append("path", `api/points/user/${account}/history`);
      baseUrl.searchParams.append("params", "chainId=80094");
      const result = await get(baseUrl.toString());
      setUserHistoryPoints(result);
    } catch (error) {
      console.error("Failed to fetch user points:", error);
    } finally {
      setUserHistoryLoading(false);
    }
  }

  useEffect(() => {
    if (account) {
      getUserPoints();
      getUserHistoryPoints();
    }
  }, [account])

  return {
    loading,
    userPoints,
    userHistoryPoints,
    userHistoryLoading,
  }
}