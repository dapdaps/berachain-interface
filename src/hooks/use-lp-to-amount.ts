import poolV2 from "@/sections/pools/abi/pool-v2"
import { asyncFetch } from "@/utils/http"
import { ethers } from "ethers"
import { useProvider } from "./use-provider"
import { useEffect, useState } from "react"
import Big from "big.js"

export default function useLpToAmount(address: any) {
  const {
    provider
  } = useProvider()

  const [pool, setPool] = useState<any>(null)
  const [totalSupply, setTotalSupply] = useState<any>()
  const handleGetPool = async function () {
    const result = await asyncFetch("https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bgt-subgraph/v1000000/gn", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: "query GetPoolList($shareAddress: String) {\n  pools(where: {shareAddress_: {address_contains: $shareAddress}}) {\n    id\n    poolIdx\n    base\n    quote\n    timeCreate\n    tvlUsd\n    baseAmount\n    quoteAmount\n    bgtApy\n    template {\n      feeRate\n      __typename\n    }\n    baseInfo {\n      id\n      address\n      symbol\n      name\n      decimals\n      usdValue\n      beraValue\n      __typename\n    }\n    quoteInfo {\n      id\n      address\n      symbol\n      name\n      decimals\n      usdValue\n      beraValue\n      __typename\n    }\n    shareAddress {\n      address\n      __typename\n    }\n    latestPoolDayData {\n      tvlUsd\n      feesUsd\n      volumeUsd\n      __typename\n    }\n    vault {\n      id\n      vaultAddress\n      __typename\n    }\n    __typename\n  }\n}",
        variables: { shareAddress: address }
      })
    })
    setPool(result?.data?.pools?.[0] ?? null)
  }
  const handleGetTotalSupply = async () => {
    const contract = new ethers.Contract(address, poolV2, provider)

    const totalSupplyResponse = await contract.totalSupply()
    setTotalSupply(ethers.utils.formatUnits(totalSupplyResponse))
  }
  const handleGetSupplyAndPool = () => {
    try {
      handleGetPool()
      handleGetTotalSupply()
    } catch (error) {
      console.log('error: ', error);
    }
  }
  const handleGetAmount = (amount: any) => {
    if (totalSupply && pool) {
      const amount0 = Big(amount).div(totalSupply).times(pool?.baseAmount).toFixed()
      const amount1 = Big(amount).div(totalSupply).times(pool?.quoteAmount).toFixed()
      return [amount0, amount1]
    } else {
      return []
    }
  }

  useEffect(() => {
    if (provider && address) {
      handleGetSupplyAndPool()
    }
  }, [provider, address])
  return {
    handleGetAmount
  }
}
