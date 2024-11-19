import poolV2 from "@/sections/pools/abi/pool-v2"
import { asyncFetch } from "@/utils/http"
import { ethers } from "ethers"
import { useProvider } from "./use-provider"
import { useEffect, useState } from "react"
import Big from "big.js"

export default function useLpToAmount(address, product = "BEX") {
  const {
    provider
  } = useProvider()

  const [pool, setPool] = useState(null)
  const [reserve0, setReserve0] = useState(0)
  const [reserve1, setReserve1] = useState(0)
  const [totalSupply, setTotalSupply] = useState()
  const handleGetPool = async function () {
    const result = await asyncFetch("https://api.goldsky.com/api/public/project_clq1h5ct0g4a201x18tfte5iv/subgraphs/bgt-subgraph/v1000000/gn", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: "query GetPoolList($shareAddress: String) {\n  pools(where: {shareAddress_: {address_contains: $shareAddress}}) {\n    id\n    poolIdx\n    base\n    quote\n    timeCreate\n    tvlUsd\n    baseAmount\n    quoteAmount\n    bgtApy\n    template {\n      feeRate\n      __typename\n    }\n    baseInfo {\n      id\n      address\n      symbol\n      name\n      decimals\n      usdValue\n      beraValue\n      __typename\n    }\n    quoteInfo {\n      id\n      address\n      symbol\n      name\n      decimals\n      usdValue\n      beraValue\n      __typename\n    }\n    shareAddress {\n      address\n      __typename\n    }\n    latestPoolDayData {\n      tvlUsd\n      feesUsd\n      volumeUsd\n      __typename\n    }\n    vault {\n      id\n      vaultAddress\n      __typename\n    }\n    __typename\n  }\n}",
        variables: { shareAddress: address.toLocaleLowerCase() }
      })
    })
    return result?.data?.pools?.[0] ?? null
  }

  const handleGetUnderlyingBalances = async () => {
    const abi = [{
      "inputs": [],
      "name": "getUnderlyingBalances",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "amount0Current",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "amount1Current",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }]
    const contract = new ethers.Contract(address, abi, provider)
    return await contract.getUnderlyingBalances()
  }
  const handleGetTotalSupply = async () => {
    const contract = new ethers.Contract(address, poolV2, provider)

    const totalSupplyResponse = await contract.totalSupply()
    setTotalSupply(ethers.utils.formatUnits(totalSupplyResponse))
  }

  const handleGetTokensReserve = async () => {
    if (product === "BEX") {
      const pool = await handleGetPool()
      setReserve0(pool?.baseAmount)
      setReserve1(pool?.quoteAmount)
    } else if (product === "Kodiak") {
      const balances = await handleGetUnderlyingBalances()
      setReserve0(ethers.utils.formatUnits(balances[0]))
      setReserve1(ethers.utils.formatUnits(balances[1]))
    } else {
      throw new Error("prouct nonsupport")
    }
  }
  const handleGetAmount = (amount) => {
    if (totalSupply && Big(reserve0 || 0).gt(0) && Big(reserve1 || 0).gt(0)) {
      const amount0 = Big(amount).div(totalSupply).times(reserve0).toFixed()
      const amount1 = Big(amount).div(totalSupply).times(reserve1).toFixed()
      return [amount0, amount1]
    } else {
      return []
    }
  }

  useEffect(() => {
    if (provider && address) {
      handleGetTotalSupply()
      handleGetTokensReserve()
    }
  }, [provider, address])
  return {
    handleGetAmount
  }
}
