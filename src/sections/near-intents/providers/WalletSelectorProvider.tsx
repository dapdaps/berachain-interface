"use client"

import type {
  AccountState,
  Wallet,
  WalletModuleFactory,
  WalletSelector,
} from "@near-wallet-selector/core"
import { setupWalletSelector } from "@near-wallet-selector/core"
import { setupMeteorWallet } from "@near-wallet-selector/meteor-wallet"
import type { WalletSelectorModal } from "@near-wallet-selector/modal-ui"
import { setupModal } from "@near-wallet-selector/modal-ui"
import { setupMyNearWallet } from "@near-wallet-selector/my-near-wallet"

import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import { distinctUntilChanged, map } from "rxjs"
import { providers } from "near-api-js"

import Loading from "@/components/loading"

declare global {
  interface Window {
    selector: WalletSelector
    modal: WalletSelectorModal
  }
}

interface WalletSelectorContextValue {
  selector: WalletSelector
  modal: WalletSelectorModal
  accounts: Array<AccountState>
  accountId: string | null
  selectedWalletId: string | null
}

const NEAR_ENV = process.env.NEAR_ENV ?? "testnet"
// 简化 RPC 配置，使用单一节点
const NEAR_NODE_URL =
  NEAR_ENV === "mainnet"
    ? "https://rpc.mainnet.near.org"
    : "https://rpc.testnet.near.org"

const WALLET_CONNECT_PROJECT_ID = process.env.walletConnectProjectId ?? ""

export const WalletSelectorContext =
  createContext<WalletSelectorContextValue | null>(null)

export const WalletSelectorProvider: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const [selector, setSelector] = useState<WalletSelector | null>(null)
  const [modal, setModal] = useState<WalletSelectorModal | null>(null)
  const [accounts, setAccounts] = useState<Array<AccountState>>([])
  const [loading, setLoading] = useState<boolean>(true)

  const init = useCallback(async () => {
    try {
      // 使用单一 JsonRpcProvider
      const provider = new providers.JsonRpcProvider({
        url: NEAR_NODE_URL,
      })

      const _selector = await setupWalletSelector({
        network: {
          networkId: NEAR_ENV,
          nodeUrl: NEAR_NODE_URL,
          helperUrl:
            NEAR_ENV === "mainnet"
              ? "https://helper.mainnet.near.org"
              : "https://helper.testnet.near.org",
          explorerUrl:
            NEAR_ENV === "mainnet"
              ? "https://nearblocks.io"
              : "https://testnet.nearblocks.io",
        },
        debug: true, // 临时开启调试以便排查问题
        modules: [
          setupMyNearWallet({
            successUrl: window.location.origin,
            failureUrl: window.location.origin,
          }) as unknown as WalletModuleFactory,
          setupMeteorWallet() as unknown as WalletModuleFactory,
          // 保持其他钱包模块的注释不变
          // setupHereWallet(),
          // setupSender(),
          // ...其他现有的钱包模块注释...
        ],
      })

      // 设置模态框
      const _modal = setupModal(_selector, {
        contractId: "",
        theme: "light",
      })

      const state = _selector.store.getState()
      setAccounts(state.accounts)

      // this is added for debugging purpose only
      // for more information (https://github.com/near/wallet-selector/pull/764#issuecomment-1498073367)
      window.selector = _selector
      window.modal = _modal

      setSelector(_selector)
      setModal(_modal)
      setLoading(false)
    } catch (err) {
      console.error("Wallet selector initialization failed:", err)
      // 添加更详细的错误日志
      if (err instanceof Error) {
        console.error("Error details:", {
          message: err.message,
          stack: err.stack,
          name: err.name,
        })
      }
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    init().catch((err) => {
      console.error(err, "<====")
      alert("Failed to initialise wallet selector")
    })
  }, [init])

  useEffect(() => {
    if (!selector) {
      return
    }

    const subscription = selector.store.observable
      .pipe(
        map((state) => state.accounts),
        distinctUntilChanged()
      )
      .subscribe((nextAccounts) => {
        console.log("Accounts Update", nextAccounts)

        setAccounts(nextAccounts)
      })

    assert(modal, "Modal is not defined")

    const onHideSubscription = modal.on("onHide", ({ hideReason }) => {
      console.log(`The reason for hiding the modal ${hideReason}`)
    })

    return () => {
      subscription.unsubscribe()
      onHideSubscription.remove()
    }
  }, [selector, modal])

  const walletSelectorContextValue = useMemo<WalletSelectorContextValue>(
    () => ({
      // biome-ignore lint/style/noNonNullAssertion: <reason>
      selector: selector!,
      // biome-ignore lint/style/noNonNullAssertion: <reason>
      modal: modal!,
      accounts,
      accountId: accounts.find((account) => account.active)?.accountId || null,
      selectedWalletId: selector?.store.getState().selectedWalletId || null,
    }),
    [selector, modal, accounts]
  )

  if (loading) {
    return <Loading />
  }

  return (
    <WalletSelectorContext.Provider value={walletSelectorContextValue}>
      {children}
    </WalletSelectorContext.Provider>
  )
}

export function useWalletSelector() {
  const context = useContext(WalletSelectorContext)

  if (!context) {
    throw new Error(
      "useWalletSelector must be used within a WalletSelectorContextProvider"
    )
  }

  return context
}

function assert(condition: unknown, msg?: string): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}
