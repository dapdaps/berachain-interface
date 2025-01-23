"use client"

import type { FinalExecutionOutcome } from "@near-wallet-selector/core"
import {
  useConnection as useSolanaConnection,
  useWallet as useSolanaWallet,
} from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { useWalletSelector } from "../providers/WalletSelectorProvider"
import type {
  SendTransactionEVMParams,
  SendTransactionSolanaParams,
  SignAndSendTransactionsParams,
} from "../types/interfaces"
import type { SendTransactionParameters } from "@wagmi/core"
import {
  type Connector,
  useAccount,
  useConnect,
  useConnections,
  useDisconnect,
} from "wagmi"
import { useEVMWalletActions } from "./useEVMWalletActions"
import { useNearWalletActions } from "./useNearWalletActions"
import { useAppKit } from "@reown/appkit/react"

export enum ChainType {
  Near = "near",
  EVM = "evm",
  Solana = "solana",
}

export type State = {
  chainType?: ChainType
  network?: string
  address?: string
}

interface ConnectWalletAction {
  signIn: (params: {
    id: ChainType
    connector?: Connector
  }) => Promise<void>
  signOut: (params: { id: ChainType }) => Promise<void>
  sendTransaction: (params: {
    id: ChainType
    tx?:
      | SignAndSendTransactionsParams["transactions"]
      | SendTransactionEVMParams["transactions"]
      | SendTransactionSolanaParams["transactions"]
  }) => Promise<string | FinalExecutionOutcome[]>
  connectors: Connector[]
  state: State
}

const defaultState: State = {
  chainType: undefined,
  network: undefined,
  address: undefined,
}

export const useConnectWallet = (): ConnectWalletAction => {
  let state: State = defaultState
  const modal = useAppKit();
  /**
   * NEAR:
   * Down below are Near Wallet handlers and actions
   */
  const nearWallet = useWalletSelector()
  const nearWalletConnect = useNearWalletActions()

  const handleSignInViaNearWalletSelector = async (): Promise<void> => {
    nearWallet.modal.show()
  }
  const handleSignOutViaNearWalletSelector = async () => {
    try {
      const wallet = await nearWallet.selector.wallet()
      console.log("Signing out", wallet)
      await wallet.signOut()
    } catch (e) {
      console.log("Failed to sign out", e)
    }
  }

  /**
   * EVM:
   * Down below are Wagmi Wallet handlers and actions
   */
  const evmWalletConnect = useConnect()
  const evmWalletDisconnect = useDisconnect()
  const { disconnect } = useDisconnect();
  const evmWalletAccount = useAccount()
  const evmWalletConnections = useConnections()
  const { sendTransactions } = useEVMWalletActions()

  const handleSignInViaWagmi = async (): Promise<void> => {
    await modal.open()
    // await evmWalletConnect.connectAsync({ connector })
  }
  const handleSignOutViaWagmi = async () => {
    // for (const { connector } of evmWalletConnections) {
    //   evmWalletDisconnect.disconnect({ connector })
    // }
    disconnect();
  }

  /**
   * Solana:
   * Down below are Solana Wallet handlers and actions
   */
  const { setVisible } = useWalletModal()
  const solanaWallet = useSolanaWallet()
  const solanaConnection = useSolanaConnection()

  const handleSignInViaSolanaSelector = async () => {
    setVisible(true)
  }

  const handleSignOutViaSolanaSelector = async () => {
    await solanaWallet.disconnect()
    await handleSignOutViaWagmi()
  }

  // 重构检查顺序,确保最新连接的钱包状态被正确设置
  if (nearWallet.accountId != null) {
    const shouldUpdateNearState = 
      state.chainType === undefined || // 初始状态
      state.chainType === ChainType.Near // 当前就是 NEAR

    if (shouldUpdateNearState) {
      state = {
        address: nearWallet.accountId,
        network: "near:mainnet",
        chainType: ChainType.Near,
      }
    }
  }

  if (evmWalletAccount.address != null && evmWalletAccount.chainId) {
    const shouldUpdateEVMState = 
      state.chainType === undefined || // 初始状态
      state.chainType === ChainType.EVM // 当前就是 EVM

    if (shouldUpdateEVMState) {
      state = {
        address: evmWalletAccount.address,
        network: evmWalletAccount.chainId
          ? `eth:${evmWalletAccount.chainId}`
          : "unknown",
        chainType: ChainType.EVM,
      }
    }
  }

  if (solanaWallet.publicKey != null) {
    const shouldUpdateSolanaState = 
      state.chainType === undefined || // 初始状态
      state.chainType === ChainType.Solana // 当前就是 Solana

    if (shouldUpdateSolanaState) {
      state = {
        address: solanaWallet.publicKey.toBase58(),
        network: "sol:mainnet",
        chainType: ChainType.Solana,
      }
    }
  }

  return {
    async signIn(params: {
      id: ChainType
      connector?: Connector
    }): Promise<void> {
      // 连接新钱包时更新状态
      state = {
        ...state,
        chainType: params.id
      }

      const strategies = {
        [ChainType.Near]: () => handleSignInViaNearWalletSelector(),
        [ChainType.EVM]: () => handleSignInViaWagmi(),
        [ChainType.Solana]: () => handleSignInViaSolanaSelector(),
      }
      return strategies[params.id]()
    },

    async signOut(params: {
      id: ChainType
    }): Promise<void> {
      const strategies = {
        [ChainType.Near]: () => handleSignOutViaNearWalletSelector(),
        [ChainType.EVM]: () => handleSignOutViaWagmi(),
        [ChainType.Solana]: () => handleSignOutViaSolanaSelector(),
      }
      return strategies[params.id]()
    },

    sendTransaction: async (
      params
    ): Promise<string | FinalExecutionOutcome[]> => {
      const strategies = {
        [ChainType.Near]: async () =>
          await nearWalletConnect.signAndSendTransactions({
            transactions:
              params.tx as SignAndSendTransactionsParams["transactions"],
          }),

        [ChainType.EVM]: async () =>
          await sendTransactions(params.tx as SendTransactionParameters),

        [ChainType.Solana]: async () => {
          const transaction =
            params.tx as SendTransactionSolanaParams["transactions"]
          return await solanaWallet.sendTransaction(
            transaction,
            solanaConnection.connection
          )
        },
      }

      const result = await strategies[params.id]()
      if (result === undefined) {
        throw new Error(`Transaction failed for ${params.id}`)
      }
      return result
    },

    connectors: evmWalletConnect.connectors as Connector[],
    state,
  }
}
