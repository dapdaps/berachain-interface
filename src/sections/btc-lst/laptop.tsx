import PageBack from '@/components/back';
import { balanceShortFormated } from "@/utils/balance";
import IconArrowSvg from '@public/images/icon-arrow.svg';
import { memo } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from './components/token-card';
import usePage, { EnabledLstItem } from './hooks/use-page';
import Skeleton from 'react-loading-skeleton'


export default memo(function Laptop() {
  const {
    wbtcToken,
    bedrockUniBTCData,
    bedrockBrBTCData, 
    selectedToken,
    setSelectedToken,
    totalStakedAmountUsd,
    btcLstComposeDataByHooks,
    handleBridge,
    handleStakeModal,
    isDataLoading
  } = usePage()

  const availableWbtc = wbtcToken || bedrockUniBTCData?.sourceToken || bedrockBrBTCData?.sourceToken;
  const availableAmount = bedrockUniBTCData?.availableAmount || '0';

  return (
    <div>
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
      <div className="w-[1200px] mx-auto">
        <div className="text-center text-black font-CherryBomb text-[60px] leading-[90%]">BTC LST</div>
        <div className="m-[25px_0_31px] p-[20px_18px_20px_30px] flex justify-between rounded-[20px] h-[110px] bg-[#FFFDEB] border border-black">
          <div className="flex-1 flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              <div className="text-black font-Montserrat text-[16px] leading-[100%]">Your Staked</div>
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                {isDataLoading ? (
                  <Skeleton width={60} height={16} />
                ) : (
                  `$${balanceShortFormated(totalStakedAmountUsd.toString())}`
                )}
              </div>
            </div>
            <div className="flex items-center gap-[45px]">
              {isDataLoading ? (
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="flex items-center gap-[12px]">
                    <Skeleton circle width={36} height={36} />
                    <Skeleton width={80} height={16} />
                  </div>
                ))
              ) : (
                btcLstComposeDataByHooks.filter(v => !v.disabled).map((item, index) => {
                  const enabledItem = item as EnabledLstItem;
                  return (
                    <div key={`${enabledItem.name}-${index}`} className="flex items-center gap-[12px]">
                      {enabledItem.targetToken?.icon && (
                        <img src={enabledItem.targetToken.icon} className="w-[36px] h-[36px] rounded-full" />
                      )}
                      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                        {balanceShortFormated(enabledItem.stakedAmount, 3)} {enabledItem.targetToken?.symbol}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="w-[305px] flex-shrink-0 flex flex-col gap-4 pl-[27px] border-l border-[rgba(0,0,0,0.2)]">
            <div className="text-black font-Montserrat text-[16px] leading-[100%]">Available to stake</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                {isDataLoading ? (
                  <>
                    <Skeleton circle width={36} height={36} />
                    <Skeleton width={80} height={16} />
                  </>
                ) : (
                  <>
                    {availableWbtc?.icon && (
                      <img src={availableWbtc.icon} className="w-[36px] h-[36px] overflow-hidden" />
                    )}
                    <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                      {balanceShortFormated(availableAmount, 3)} WBTC
                    </div>
                  </>
                )}
              </div>
              <div onClick={handleBridge} className="w-[115px] h-[40px] bg-[#FFDC50] border border-black flex items-center justify-center gap-[10px] rounded-[10px] cursor-pointer hover:bg-opacity-50">
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">Bridge</span>
                <IconArrowSvg className="-rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[30px_21px] flex-wrap">
          {isDataLoading ? (
            Array(6).fill(0).map((_, index) => (
              <div key={index} className="relative h-[270px] md:w-full w-[calc((100%_-_42px)_/_3)] rounded-[20px] ">
                  <Skeleton height={270} />
              </div>
            ))
          ) : (
            btcLstComposeDataByHooks.length && btcLstComposeDataByHooks.map((item, index) => (
              <TokenCard 
                wbtc={availableWbtc} 
                item={item} 
                key={`${item.name}-${index}`} 
                onClick={() => handleStakeModal(item)} 
              />
            ))
          )}
        </div>
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