import { useEffect, useState } from "react";
import useCustomAccount from "./use-account";
import { get } from "@/utils/http";

export default function useUserPoints() {
  const { account } = useCustomAccount()
  const [loading, setLoading] = useState(false)
  const [userPoints, setUserPoints] = useState()
  async function getUserPoints() {
    try {
      setLoading(true)
      const result = await get("https://dev-api.beratown.app/infrared?path=api%2Fpoints%2Fuser%2F" + account + "&params=chainId%3D80094")
      setUserPoints(result)
    } catch (error) {
      console.log(error)
    }
    setLoading(false)
  }
  useEffect(() => {
    account && getUserPoints()
  }, [account])

  return {
    loading,
    userPoints
  }
}