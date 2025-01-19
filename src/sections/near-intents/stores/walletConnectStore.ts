"use client"

import { createStore } from "zustand/vanilla"
import { persist, createJSONStorage } from "zustand/middleware"
import { ChainType } from "../hooks/useConnectWallet"

export type WalletConnectState = {
  pendingChainType: ChainType | null
  previousChainType: ChainType | null
  isNearRedirecting: boolean
}

export type WalletConnectActions = {
  setPendingChainType: (chainType: ChainType | null) => void
  setPreviousChainType: (chainType: ChainType | null) => void
  setIsNearRedirecting: (isRedirecting: boolean) => void
  reset: () => void
}

export type WalletConnectStore = WalletConnectState & WalletConnectActions

const defaultInitState: WalletConnectState = {
  pendingChainType: null,
  previousChainType: null,
  isNearRedirecting: false,
}

export const createWalletConnectStore = (initState: WalletConnectState = defaultInitState) => {
  return createStore<WalletConnectStore>()(
    persist(
      (set) => ({
        ...initState,
        setPendingChainType: (chainType: ChainType | null) => 
          set({ pendingChainType: chainType }),
        setPreviousChainType: (chainType: ChainType | null) =>
          set({ previousChainType: chainType }),
        setIsNearRedirecting: (isRedirecting: boolean) =>
          set({ isNearRedirecting: isRedirecting }),
        reset: () => set(defaultInitState),
      }),
      {
        name: 'wallet-connect-storage_v1.0.0', // 存储的唯一标识符
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
}
