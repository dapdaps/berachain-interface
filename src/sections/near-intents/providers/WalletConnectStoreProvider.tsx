"use client"

import { createContext, useContext, useRef } from "react"
import { type StoreApi, useStore } from "zustand"
import {
  type WalletConnectStore,
  createWalletConnectStore,
} from "../stores/walletConnectStore"

const WalletConnectStoreContext = createContext<StoreApi<WalletConnectStore> | null>(null)

export interface WalletConnectStoreProviderProps {
  children: React.ReactNode
}

export const WalletConnectStoreProvider = ({ children }: WalletConnectStoreProviderProps) => {
  const storeRef = useRef<StoreApi<WalletConnectStore>>()
  if (!storeRef.current) {
    storeRef.current = createWalletConnectStore()
  }
  return (
    <WalletConnectStoreContext.Provider value={storeRef.current}>
      {children}
    </WalletConnectStoreContext.Provider>
  )
}

export const useWalletConnectStore = <T,>(selector: (store: WalletConnectStore) => T): T => {
  const store = useContext(WalletConnectStoreContext)
  if (!store) throw new Error('Missing WalletConnectStoreProvider')
  return useStore(store, selector)
}
