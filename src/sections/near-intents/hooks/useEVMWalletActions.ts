import type { SendTransactionParameters } from "@wagmi/core"
import { stringify } from "viem"
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi"

export function useEVMWalletActions() {
  const { sendTransactionAsync } = useSendTransaction()
  const { switchChainAsync } = useSwitchChain()
  const { connector } = useAccount()

  return {
    sendTransactions: async (tx: SendTransactionParameters) => {
      try {
        console.log("Sending transaction", stringify({ tx }))

        const chainId = tx.chainId
        const currentChainId = await connector?.getChainId()
        
        if (chainId != null && currentChainId !== chainId) {
          console.log("Switching chain", stringify({ currentChainId, chainId }))
          try {
            await switchChainAsync({ chainId })
          } catch (switchError) {
            console.error("Chain switch failed:", switchError)
          }
        }

        const txHash = await sendTransactionAsync({
          connector,
          gas: null, // Skip gas estimation
          ...tx,
        })

        return txHash
      } catch (error) {
        console.error("Transaction failed:", error)
        throw error
      }
    },
  }
}
