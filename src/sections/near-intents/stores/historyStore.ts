"use client"

import { createStore } from "zustand/vanilla"

import { NEAR_COLLECTOR_KEY } from "../constants/contracts"
import type {
  NearTX,
  NetworkToken,
  RecoverDetails,
} from "../types/interfaces"

export enum HistoryStatus {
  INTENT_1_AVAILABLE = "available",
  AVAILABLE = "Available",
  PROCESSING = "Processing",
  COMPLETED = "Completed",
  INTENT_1_EXECUTED = "executed",
  INTENT_1_ROLLED_BACK = "rolled_back",
  ROLLED_BACK = "RolledBack",
  EXPIRED = "Expired",
  FAILED = "Failed", // Internal status
  WITHDRAW = "Withdraw", // Internal status
  DEPOSIT = "Deposit", // Internal status
  SWAPPED = "Swapped", // Internal status
  STORAGE_DEPOSIT = "Storage Deposit", // Internal status
}

export type HistoryData = {
  intentId: string
  hash: string
  timestamp: number
  status?: HistoryStatus
  proof?: string
  errorMessage?: string
  isClosed?: boolean
  details?: {
    tokenIn?: string
    tokenOut?: string
    selectedTokenIn?: NetworkToken
    selectedTokenOut?: NetworkToken
    recoverDetails?: RecoverDetails
  } & Partial<NearTX>
}

export type HistoryState = {
  active: boolean
  activePreview?: string
  data: Map<string, HistoryData>
  isFetched: boolean
}

export type HistoryActions = {
  openWidget: () => void
  closeWidget: () => void
  togglePreview: (hash: string | undefined) => void
  toggleWidget: () => void
  updateHistory: (data: HistoryData[]) => void
  updateOneHistory: (data: HistoryData) => void
  closeHistoryItem: (hash: HistoryData["hash"]) => void
}

export type HistoryStore = HistoryState & HistoryActions

export const initHistoryStore = (): HistoryState => {
  return { active: false, data: new Map(), isFetched: false }
}

export const defaultInitState: HistoryState = {
  active: false,
  data: new Map(),
  isFetched: false,
}

const helperHistoryLocalStore = (data: HistoryState["data"]): void => {
  const getHistoryFromStore: HistoryData[] = []
  for (const value of data.values()) getHistoryFromStore.push(value)
  localStorage.setItem(
    NEAR_COLLECTOR_KEY,
    JSON.stringify({ data: getHistoryFromStore }, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  )
}

export const createHistoryStore = (
  initState: HistoryState = defaultInitState
) => {
  return createStore<HistoryStore>()((set) => ({
    ...initState,
    openWidget: () => set({ active: true }),
    closeWidget: () => set({ active: false }),
    togglePreview: (hash: string | undefined) => set({ activePreview: hash }),
    toggleWidget: () => set((state) => ({ active: !state.active })),
    updateHistory: (data: HistoryData[]) =>
      set((state) => {
        const updatedData = new Map(state.data)
        for (const item of data) updatedData.set(item.hash, item)
        helperHistoryLocalStore(updatedData as HistoryState["data"])
        return { data: updatedData, isFetched: true }
      }),
    updateOneHistory: (one: HistoryData) =>
      set((state) => {
        const updatedData = new Map(state.data)
        updatedData.set(one.hash, one)
        return { data: updatedData }
      }),
    closeHistoryItem: (hash: HistoryData["hash"]) =>
      set((state) => {
        const currentData = state.data
        const getItem = currentData.get(hash)
        currentData.set(hash, {
          ...getItem,
          isClosed: true,
        } as HistoryData)
        helperHistoryLocalStore(currentData)
        return { data: currentData }
      }),
  }))
}
