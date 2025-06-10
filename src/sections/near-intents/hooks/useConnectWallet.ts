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
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useConnectedWalletsStore } from '@/stores/useConnectedWalletsStore';
import { useEffect } from 'react';
import useIsMobile from "@/hooks/use-isMobile"
import useToast from "@/hooks/use-toast"

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

  const isMobile = useIsMobile();
  const toast = useToast();

  const { addWallet, removeWallet, connectedWallets, isWalletConnected } = useConnectedWalletsStore();
  const currentState = connectedWallets[0]; // 第一个钱包为当前活跃钱包
  const modal = useConnectModal();
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

  // 监听 wagmi disconnect 事件
  useEffect(() => {
    if (!evmWalletAccount.address && isWalletConnected(ChainType.EVM)) {
      console.log('EVM wallet disconnected, removing from store');
      removeWallet(ChainType.EVM);
    }
  }, [evmWalletAccount.address]);

  const handleSignInViaWagmi = async (): Promise<void> => {
    await modal.openConnectModal?.()
    // await evmWalletConnect.connectAsync({ connector })
  }
  const handleSignOutViaWagmi = async () => {
    disconnect();
    for (const { connector } of evmWalletConnections) {
      evmWalletDisconnect.disconnect({ connector })
    }
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
    // await handleSignOutViaWagmi()
  }

  if (nearWallet.accountId != null && !isWalletConnected(ChainType.Near)) {
    const walletState = {
      address: nearWallet.accountId,
      network: "near:mainnet",
      chainType: ChainType.Near,
    }
    addWallet(walletState);
  }

  if (evmWalletAccount.address != null && evmWalletAccount.chainId && !isWalletConnected(ChainType.EVM)) {
    const walletState = {
      address: evmWalletAccount.address,
      network: evmWalletAccount.chainId
        ? `eth:${evmWalletAccount.chainId}`
        : "unknown",
      chainType: ChainType.EVM,
    }
    addWallet(walletState);
  }

  if (solanaWallet.publicKey != null && !isWalletConnected(ChainType.Solana)) {
    const walletState = {
      address: solanaWallet.publicKey.toBase58(),
      network: "sol:mainnet",
      chainType: ChainType.Solana,
    }
    addWallet(walletState);
  }

  return {
    async signIn(params: {
      id: ChainType
      connector?: Connector
    }): Promise<void> {
      if (isMobile) {
        toast.info({
          title: "Please visit the desktop version for a better experience."
        })
        return
      }
      const strategies = {
        [ChainType.Near]: async () => {
          await handleSignInViaNearWalletSelector();
        },
        [ChainType.EVM]: async () => {
          await handleSignInViaWagmi();
        },
        [ChainType.Solana]: async () => {
          await handleSignInViaSolanaSelector();  
        },
      }
      return strategies[params.id]()
    },

    async signOut(params: {
      id: ChainType
    }): Promise<void> {
      const strategies = {
        [ChainType.Near]: async () => {
          await handleSignOutViaNearWalletSelector();
          removeWallet(ChainType.Near);
        },
        [ChainType.EVM]: async () => {
          console.log("EVM signOut called");
          await handleSignOutViaWagmi();
        },
        [ChainType.Solana]: async () => {
          await handleSignOutViaSolanaSelector();
          removeWallet(ChainType.Solana);
        },
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
    state: currentState || defaultState,
  }
}
