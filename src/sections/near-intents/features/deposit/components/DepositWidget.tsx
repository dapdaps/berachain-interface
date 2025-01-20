import { useEffect } from "react"
import { DepositWidgetProvider } from "../../../providers/DepositWidgetProvider"
import { useTokensStore } from "../../../providers/TokensStoreProvider"
import type { DepositWidgetProps } from "../../../types/deposit"
import { DepositForm } from "./DepositForm"
import { DepositFormProvider } from "./DepositFormProvider"
import { DepositUIMachineFormSyncProvider } from "./DepositUIMachineFormSyncProvider"
import { DepositUIMachineProvider } from "./DepositUIMachineProvider"
import useAddAction from "@/hooks/use-add-action"
import useToast from "@/hooks/use-toast"
import { ethers } from "ethers"

export const DepositWidget = ({
  tokenList,
  userAddress,
  chainType,
  sendTransactionNear,
  sendTransactionEVM,
  sendTransactionSolana,
}: DepositWidgetProps) => {

    const { addAction } = useAddAction("dapp")

    const toast = useToast()

  return (
      <DepositWidgetProvider>
        <TokenListUpdater tokenList={tokenList} />
        <DepositFormProvider>
          <DepositUIMachineProvider
            tokenList={tokenList}
            sendTransactionNear={sendTransactionNear}
            sendTransactionEVM={sendTransactionEVM}
            sendTransactionSolana={sendTransactionSolana}
            onDepositSuccess={({ txHash, token, amount, userAddress, chainName }) => {
              console.log("onDepositSuccess", txHash, token, amount, userAddress, chainName)
              addAction?.({
                type: "Staking",
                action: 'Staking',
                status: 1,
                sub_type: "Deposit", 
                transactionHash: txHash,
                template: "near-intents",
                token: token,
                amount: ethers.utils.formatUnits(amount, token.decimals)
              })
            }}
          >
            <DepositUIMachineFormSyncProvider
              userAddress={userAddress}
              userChainType={chainType}
            >
              <DepositForm chainType={chainType} />
            </DepositUIMachineFormSyncProvider>
          </DepositUIMachineProvider>
        </DepositFormProvider>
      </DepositWidgetProvider>
  )
}

function TokenListUpdater({
  tokenList,
}: { tokenList: DepositWidgetProps["tokenList"] }) {
  const { updateTokens } = useTokensStore((state) => state)

  useEffect(() => {
    updateTokens(tokenList)
  }, [tokenList, updateTokens])

  return null
}
