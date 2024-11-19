import { VAULTS_URL } from "@/sections/bgt/config/gauge"
import { asyncFetch } from "@/utils/http"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function useGauge(id: string) {
  const params = useSearchParams()
  const defaultAddress = params.get("address")
  const [address, setAddress] = useState(defaultAddress);
  const [data, setData] = useState()

  const queryData = async function () {

    const response = await asyncFetch(VAULTS_URL + address)
    setData(response?.vault)
  }
  useEffect(() => {
    console.log('====address', address)
    queryData()
  }, [address])

  useEffect(() => {
    if (defaultAddress) {
      setAddress(defaultAddress)
    } else {
      setAddress(id)
    }
  }, [defaultAddress, id])

  return {
    data
  }
}