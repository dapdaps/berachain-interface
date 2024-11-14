import { VAULTS_URL } from "@/sections/bgt/config/gauge"
import { asyncFetch } from "@/utils/http"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function useGauge() {


  const params = useSearchParams()
  const address = params.get("address")
  const [data, setData] = useState()

  const queryData = async function () {

    const response = await asyncFetch(VAULTS_URL + address)
    setData(response?.vault)
  }
  useEffect(() => {
    queryData()
  }, [address])

  return {
    data
  }
}