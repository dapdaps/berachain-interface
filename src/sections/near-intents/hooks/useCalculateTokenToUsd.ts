import { useState } from "react"

import type { NetworkToken } from "../types/interfaces"

export const useCalculateTokenToUsd = () => {
  const [priceToUsd, setPriceToUsd] = useState("0")

  const calculateTokenToUsd = (
    amount: string,
    selectToken: NetworkToken | undefined
  ) => {
    if (!selectToken || !Number.parseFloat(amount)) {
      setPriceToUsd("0")
      return
    }
    const convertPrice = selectToken?.convertedLast?.usd
    const amountToUsd = convertPrice
      ? (Number(amount) * convertPrice).toString()
      : "0"
    setPriceToUsd(amountToUsd)
  }

  return {
    priceToUsd,
    calculateTokenToUsd,
  }
}
