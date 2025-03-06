"use client"

import { useEffect, useState } from "react"

import { NEAR_COLLECTOR_KEY } from "../constants/contracts"
import { useHistoryLatest } from "../hooks/useHistoryLatest"
import { useQueryCollector } from "../hooks/useQuery"
import { adapterIntent0, adapterIntent1 } from "../libs/de-sdk/utils/adapters"
import { useHistoryStore } from "../providers/HistoryStoreProvider"
import type { HistoryData } from "../stores/historyStore"

export interface CollectorHook {
  getTransactions: () => Promise<HistoryData[]>
}

// This hook uses modules for gathering historical transactions, filtering, and
// transferring to history module
export const useHistoryCollector = (collectorHooks: CollectorHook[]) => {
  const [isFetching, setIsFetching] = useState(false)
  const [isError, setIsError] = useState(false)
  const { data, updateHistory } = useHistoryStore((state) => state)
  const { runHistoryUpdate } = useHistoryLatest()

  const runTransactionCollector = async () => {
    try {
      setIsFetching(true)
      const allTransactions = await Promise.all(
        collectorHooks.map((hook) => hook.getTransactions())
      )
      const getTransactionHistories = allTransactions.flat()
      const getHistoryFromLocal = localStorage.getItem(NEAR_COLLECTOR_KEY)
      let getHistoryFromStore: HistoryData[] = []

      for (const value of data.values()) getHistoryFromStore.push(value)

      // Do merge as we suppose that this is initial fetch
      if (!getHistoryFromStore.length && getHistoryFromLocal) {
        const parsedData: { data: HistoryData[] } =
          JSON.parse(getHistoryFromLocal)

        if (Array.isArray(parsedData.data)) {
          getHistoryFromStore = [
            ...getHistoryFromStore,
            ...(parsedData.data as HistoryData[]),
          ]
        }
      }
      const history = [...getHistoryFromStore, ...getTransactionHistories]
      // console.log("Data before store to the history: ", history)
      updateHistory(history)

      const validHistoryStatuses: string[] = [
        ...adapterIntent0.completedStatuses,
        ...adapterIntent1.completedStatuses,
      ]

      console.log("Data after store to the history: ", history)

      const isHistoryNotComplete = history.some(
        (history) =>
          !history?.errorMessage?.length &&
          !validHistoryStatuses.includes(history?.status ?? "")
      )

      
      if (isHistoryNotComplete) runHistoryUpdate(history)

      setIsFetching(false)
    } catch (e) {
      console.log("runTransactionCollector: ", e)
      setIsError(true)
      setIsFetching(false)
    }
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: <reason>
  useEffect(() => {
    if (data.size) {
      runTransactionCollector()
    }
  }, [data.size])

  return {
    runTransactionCollector,
    isFetching,
    isError,
  }
}

export const useCombinedHistoryCollector = () => {
  const queryCollector = useQueryCollector()
  return useHistoryCollector([queryCollector])
}
