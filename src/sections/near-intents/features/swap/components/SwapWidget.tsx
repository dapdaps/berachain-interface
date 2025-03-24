import PageBack from "@/components/back"
import Tabs from "@/components/tabs"
import useIsMobile from "@/hooks/use-isMobile"
import useToast from "@/hooks/use-toast"
import useYourRank from "@/sections/compaign/hooks/use-your-rank"
import ConnectWalletBar from "@/sections/near-intents/components/ConnectWalletBar"
import { useModalStore } from "@/sections/near-intents/providers/ModalStoreProvider"
import { ModalType } from "@/sections/near-intents/stores/modalStore"
import Portfolio from "@/sections/near-intents/views/Portfolio"
import { numberFormatter } from "@/utils/number-formatter"
import { useEffect, useState } from "react"
import { SwapWidgetProvider } from "../../../providers/SwapWidgetProvider"
import { useTokensStore } from "../../../providers/TokensStoreProvider"
import type { SwapWidgetProps } from "../../../types/swap"
import { SwapForm } from "./SwapForm"
import { SwapFormProvider } from "./SwapFormProvider"
import { SwapSubmitterProvider } from "./SwapSubmitter"
import { SwapUIMachineFormSyncProvider } from "./SwapUIMachineFormSyncProvider"
import { SwapUIMachineProvider } from "./SwapUIMachineProvider"

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

  const {
    yourRank,
    loading: loadingYourRank
  } = useYourRank("volume")
  
  const { setModalType } = useModalStore(
    (state) => state
  )

  const isMobile = useIsMobile();
  const toast = useToast();

  const handleDeposit = () => {
    if (isMobile) {
      toast.info({
        title: "Please visit the desktop version for a better experience."
      })
      return
    }
    setModalType(ModalType.MODAL_REVIEW_DEPOSIT)
  }

  const [currentTab, setCurrentTab] = useState<string>('assets');

  const Laptop = () => (
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
        <SwapForm />
        {
          yourRank?.away_top_volume && (
            <div className="absolute left-1/2 -bottom-[16px] -translate-x-1/2 translate-y-[100%] w-[520px] h-[54px] bg-[url('/images/compaign/ribbon.svg')] bg-center bg-no-repeat">
              <div className="p-[12px_44px_0] flex items-center justify-center gap-[17px]">
                <span className="text-black text-[14px] font-Montserrat font-bold whitespace-nowrap">You're only {numberFormatter(yourRank?.away_top_volume ?? 0, 2, true, { isShort: true })} in PnL away from a top 10 spot.</span>
                <span className="text-black text-[12px] font-Montserrat font-semibold underline whitespace-nowrap">View Rank</span>
              </div>
            </div>
          )
        }
      </div>
      <Portfolio />
    </div>
  )

  const Mobile = () => (
    <div className="w-full">
      <div className="flex items-center pl-5 pt-4 pr-2 gap-2.5">
        <PageBack showBackText={false} />
        <img src="/images/background/intents-mobile-logo.png" className="w-[118px] h-[30px] object-contain" alt="" />
        <ConnectWalletBar />
      </div>
      <div className="mt-5 max-h-[90dvh] overflow-y-auto mb-5 scrollbar-hide pb-[50px]">
        <Tabs
          isCard
          currentTab={currentTab}
          tabs={[
            {
              key: 'assets',
              label: 'Assets',
              children: <Portfolio />
            },
            {
              key: 'swap',
              label: 'Swap',
              children: <SwapForm />
            }
          ]}
          onChange={(key) => setCurrentTab(key as string)}
        />

        {
          currentTab === 'swap' && (
            <div className="mt-[18px] mx-2 flex justify-between items-center p-2.5 bg-[#FFFDEB] border border-[#373A53] rounded-[20px] shadow-shadow1">
              <div className="font-Montserrat font-[600]">
                Complete a Deposit to Start Your Trading Journey.
              </div>
              <div className="font-[600] w-[98px] flex items-center gap-1 rounded-[10px] p-[5px] bg-[#FFDC50] border border-black cursor-pointer hover:opacity-60" onClick={handleDeposit}>
                Deposit
              </div>
            </div>
          )
        }
      </div>
    </div>
  )


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
              {
                isMobile ? <Mobile /> : <Laptop />
              }
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
