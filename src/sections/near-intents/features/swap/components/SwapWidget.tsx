import { useEffect } from "react"
import { SwapWidgetProvider } from "../../../providers/SwapWidgetProvider"
import { useTokensStore } from "../../../providers/TokensStoreProvider"
import type { SwapWidgetProps } from "../../../types/swap"
import { SwapForm } from "./SwapForm"
import { SwapFormProvider } from "./SwapFormProvider"
import { SwapSubmitterProvider } from "./SwapSubmitter"
import { SwapUIMachineFormSyncProvider } from "./SwapUIMachineFormSyncProvider"
import { SwapUIMachineProvider } from "./SwapUIMachineProvider"
import Portfolio from "@/sections/near-intents/views/Portfolio"
import { useModalStore } from "@/sections/near-intents/providers/ModalStoreProvider"
import { ModalType } from "@/sections/near-intents/stores/modalStore"

export const SwapWidget = ({
  tokenList,
  userAddress,
  userChainType,
  sendNearTransaction,
  signMessage,
  onSuccessSwap,
  onNavigateDeposit,
  initialTokenIn,
  initialTokenOut,
}: SwapWidgetProps) => {
  
  const { setModalType } = useModalStore(
    (state) => state
  )

  const handleDeposit = () => {
    setModalType(ModalType.MODAL_REVIEW_DEPOSIT)
  }

  return (
      <SwapWidgetProvider>
        <TokenListUpdater tokenList={tokenList} />
        <SwapFormProvider>
          <SwapUIMachineProvider
            initialTokenIn={initialTokenIn}
            initialTokenOut={initialTokenOut}
            tokenList={tokenList}
            signMessage={signMessage}
          >
            <SwapUIMachineFormSyncProvider
              userAddress={userAddress}
              userChainType={userChainType}
              onSuccessSwap={onSuccessSwap}
            >
              <SwapSubmitterProvider
                userAddress={userAddress}
                userChainType={userChainType}
                sendNearTransaction={sendNearTransaction}
              >
                <div className="flex justify-end items-start w-full">
                  <div className="w-[520px] flex flex-col justify-center absolute left-1/2 transform -translate-x-1/2">
                    <div className="mb-[18px] flex justify-between items-center p-[17px] bg-[#FFFDEB] border border-[#373A53] rounded-[20px] shadow-shadow1">
                      <div className="font-Montserrat font-[600]">
                        Complete a Deposit to Start Your Trading Journey.
                      </div>
                      <div className="font-[600] w-[130px] flex items-center gap-1 rounded-[10px] p-[5px] bg-[#FFDC50] border border-black cursor-pointer hover:opacity-60" onClick={handleDeposit}>
                        Deposit first
                      </div>
                    </div>
                    <SwapForm onNavigateDeposit={onNavigateDeposit} />
                  </div>
                  <Portfolio />
                </div>  
              </SwapSubmitterProvider>
            </SwapUIMachineFormSyncProvider>
          </SwapUIMachineProvider>
        </SwapFormProvider>
      </SwapWidgetProvider>
  )
}

function TokenListUpdater({
  tokenList,
}: { tokenList: SwapWidgetProps["tokenList"] }) {
  const { updateTokens } = useTokensStore((state) => state)

  useEffect(() => {
    updateTokens(tokenList)
  }, [tokenList, updateTokens])

  return null
}
