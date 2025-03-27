import PageBack from "@/components/back";
import { Token } from "@/types";
import { memo, useState } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from "./components/token-card";
import usePage, { EnabledLstItem } from "./hooks/use-page";
import { balanceShortFormated } from "@/utils/balance";

export default memo(function Mobile() {
  const {
    wbtcToken,
    bedrockData,
    selectedToken,
    setSelectedToken,
    totalStakedAmountUsd,
    btcLstComposeDataByHooks,
    handleBridge,
    handleStakeModal,
  } = usePage()
  return (
    <div className="h-full p-[8px] overflow-auto">
      <PageBack className="md:absolute md:left-[12px] md:top-[17px] z-[10]" />
      <div className="m-[23px_auto] relative flex items-center w-[200px] h-[50px] border border-black bg-[#E9B965] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.50)]">
        <span className="ml-[64px] text-black font-CherryBomb text-[24px] leading-[90%]">BTC LST</span>
        <div className="absolute -left-[13px] -top-[17px] w-[73px]">
          <img src="/images/btc-lst/pea-pod.svg" alt="pea-pod" />
        </div>
      </div>

      <div className="mb-[10px] p-[22px_16px_14px] rounded-[20px] h-[152px] bg-[rgba(255,253,235,0.40)] backdrop-blur-[10px]">

        <div className="flex items-center justify-between">
          <span className="text-black font-Montserrat text-[14px] leading-[100%]">Your Staked</span>
          <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">${balanceShortFormated(totalStakedAmountUsd.toString())}</span>
        </div>

        <div className="flex items-center justify-end gap-[6px]">
          {
            btcLstComposeDataByHooks.filter(v => !v.disabled).map((item, index) => {
              const enabledItem = item as EnabledLstItem;
              return (

                <div key={enabledItem.name} className="flex items-center gap-[4px] p-[6px_8px] h-[32px] rounded-[6px] bg-[rgba(0,0,0,0.06)]">
                  <img src={enabledItem.targetToken.icon} className="w-[20px] h-[20px] rounded-full" />
                  <div className="w-[20px] h-[20px] rounded-full overflow-hidden"></div>
                  <div className="text-black font-Montserrat text-[12px] font-semibold leading-[100%]">{balanceShortFormated(enabledItem.stakedAmount, 3)} {enabledItem.targetToken.symbol}</div>
                </div>
              );
            })
          }
        </div>

        <div className="my-[14px] h-[1px] bg-black opacity-20" />

        <div className="flex items-center justify-between">
          <span className="text-black font-Montserrat text-[14px] leading-[100%]">Available to stake</span>
          <div className="flex items-center">
            <div className="w-[20px] h-[20px] rounded-full overflow-hidden">
              <img src={wbtcToken.icon} />
            </div>
            <div className="m-[0_12px_0_4px] text-black font-Montserrat text-[14px] font-semibold leading-[100%]">{balanceShortFormated(bedrockData.availableAmount, 3)} {wbtcToken?.symbol}</div>
            <div onClick={handleBridge} className="w-[78px] h-[32px] rounded-[6px] border border-black bg-white flex items-center justify-center text-black font-Montserrat text-[12px] font-semibold">Bridge</div>
          </div>
        </div>

      </div>

      <div className="flex flex-col gap-[10px]">
        {
          btcLstComposeDataByHooks.length && btcLstComposeDataByHooks.map((item, index) => (
            <TokenCard item={item} key={item.name} onClick={() => handleStakeModal(item)} />
          ))
        }
      </div>
      {
        selectedToken && (
          <StakeModal
            token={selectedToken}
            onClose={() => {
              setSelectedToken(null)
            }}
          />
        )
      }
    </div>
  )
})
