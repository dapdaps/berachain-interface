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
    const response = await asyncFetch("https://api.berachain.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "operationName": "GetRewardVault",
        "variables": { "vaultId": address, "chain": "BERACHAIN" },
        "query": "query GetRewardVault($vaultId: String!, $chain: GqlChain!) {\n  rewardVault: polGetRewardVault(vaultAddress: $vaultId, chain: $chain) {\n    ...ApiVault\n    __typename\n  }\n}\n\nfragment ApiVault on GqlRewardVault {\n  id: vaultAddress\n  vaultAddress\n  address: vaultAddress\n  isVaultWhitelisted\n  dynamicData {\n    allTimeReceivedBGTAmount\n    apr\n    bgtCapturePercentage\n    activeIncentivesValueUsd\n    __typename\n  }\n  stakingToken {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  metadata {\n    name\n    logoURI\n    url\n    protocolName\n    description\n    __typename\n  }\n  activeIncentives {\n    ...ApiVaultIncentive\n    __typename\n  }\n  __typename\n}\n\nfragment ApiVaultIncentive on GqlRewardVaultIncentive {\n  active\n  remainingAmount\n  remainingAmountUsd\n  incentiveRate\n  tokenAddress\n  token {\n    address\n    name\n    symbol\n    decimals\n    __typename\n  }\n  __typename\n}"
      }
      )
    })
    setData(response?.data?.rewardVault)
  }
  useEffect(() => {
    address && queryData()
  }, [address])

  useEffect(() => {
    console.log('=====defaultAddress', defaultAddress)
    console.log('=====id', id)
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