import PageBack from "@/components/back";
import { Token } from "@/types";
import { memo, useState } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from "./components/token-card";
import usePage, { EnabledLstItem } from "./hooks/use-page";
import { balanceShortFormated } from "@/utils/balance";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css';

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
    isDataLoading
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
          <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
            {isDataLoading ? (
              <Skeleton width={60} height={16} />
            ) : (
              `$${balanceShortFormated(totalStakedAmountUsd.toString())}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-end gap-[6px]">
          {isDataLoading ? (
            Array(2).fill(0).map((_, index) => (
              <div key={index} className="flex items-center gap-[4px] p-[6px_8px] h-[32px] rounded-[6px] bg-[rgba(0,0,0,0.06)]">
                <Skeleton circle width={20} height={20} />
                <Skeleton width={70} height={12} />
              </div>
            ))
          ) : (
            btcLstComposeDataByHooks.filter(v => !v.disabled).map((item, index) => {
              const enabledItem = item as EnabledLstItem;
              return (
                <div key={enabledItem.name} className="flex items-center gap-[4px] p-[6px_8px] h-[32px] rounded-[6px] bg-[rgba(0,0,0,0.06)]">
                  <img src={enabledItem.targetToken.icon} className="w-[20px] h-[20px] rounded-full" />
                  <div className="text-black font-Montserrat text-[12px] font-semibold leading-[100%]">
                    {balanceShortFormated(enabledItem.stakedAmount, 3)} {enabledItem.targetToken.symbol}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="my-[14px] h-[1px] bg-black opacity-20" />

        <div className="flex items-center justify-between">
          <span className="text-black font-Montserrat text-[14px] leading-[100%]">Available to stake</span>
          <div className="flex items-center">
            {isDataLoading ? (
              <>
                <Skeleton circle width={20} height={20} />
                <div className="m-[0_12px_0_4px]">
                  <Skeleton width={70} height={14} />
                </div>
                <Skeleton width={78} height={32} borderRadius={6} />
              </>
            ) : (
              <>
                <div className="w-[20px] h-[20px] rounded-full overflow-hidden">
                  <img src={wbtcToken.icon} />
                </div>
                <div className="m-[0_12px_0_4px] text-black font-Montserrat text-[14px] font-semibold leading-[100%]">
                  {balanceShortFormated(bedrockData.availableAmount, 3)} {wbtcToken?.symbol}
                </div>
                <div onClick={handleBridge} className="w-[78px] h-[32px] rounded-[6px] border border-black bg-white flex items-center justify-center text-black font-Montserrat text-[12px] font-semibold">
                  Bridge
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-[10px]">
        {isDataLoading ? (
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="p-[16px] rounded-[20px] bg-[rgba(255,253,235,0.40)] backdrop-blur-[10px]">
              <div className="flex items-center gap-[8px] mb-[16px]">
                <Skeleton circle width={40} height={40} />
                <div className="flex flex-col gap-[4px]">
                  <Skeleton width={70} height={16} />
                  <div className="flex items-center gap-[3px]">
                    <Skeleton circle width={12} height={12} />
                    <Skeleton width={60} height={10} />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mb-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <Skeleton width={30} height={12} />
                  <Skeleton width={60} height={14} />
                  <Skeleton width={50} height={10} />
                </div>
                
                <div className="flex flex-col gap-[4px]">
                  <Skeleton width={30} height={12} />
                  <Skeleton width={40} height={14} />
                </div>
                
                <div className="flex flex-col gap-[4px]">
                  <Skeleton width={60} height={12} />
                  <Skeleton width={60} height={14} />
                  <Skeleton width={50} height={10} />
                </div>
              </div>
              
              <Skeleton width="100%" height={40} borderRadius={10} />
            </div>
          ))
        ) : (
          btcLstComposeDataByHooks.length > 0 && btcLstComposeDataByHooks.map((item, index) => (
            <TokenCard wbtc={wbtcToken} item={item} key={item.name} onClick={() => handleStakeModal(item)} />
          ))
        )}
      </div>
      
      {selectedToken && (
        <StakeModal
          token={selectedToken}
          onClose={() => {
            setSelectedToken(null)
          }}
        />
      )}
    </div>
  )
})