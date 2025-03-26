import IconArrowSvg from '@public/images/icon-arrow.svg';
import { memo, useState } from "react";
import StakeModal from "./components/stake-modal";
import { Token } from '@/types';
import PageBack from '@/components/back';

export default memo(function Laptop() {
  const [currentTab, setCurrentTab] = useState("stake")
  const [checkedToken, setCheckedToken] = useState<null | Token>(null)

  return (
    <div>
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
      <div className="w-[1200px] mx-auto">
        <div className="text-center text-black font-CherryBomb text-[60px] leading-[90%]">BTC LST</div>
        <div className="m-[25px_0_31px] p-[20px_18px_20px_30px] flex justify-between rounded-[20px] h-[110px] bg-[#FFFDEB] border border-black">
          <div className="flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              <div className="text-black font-Montserrat text-[16px] leading-[100%]">Your Staked</div>
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">$368.58</div>
            </div>
            <div className="flex items-center gap-[45px]">
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] overflow-hidden"></div>
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">0.02 UniBTC</div>
              </div>
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] overflow-hidden"></div>
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">0.02 UniBTC</div>
              </div>
            </div>
          </div>

          <div className="pl-[27px] border-l border-[rgba(0,0,0,0.2)]">
            <div className="text-black font-Montserrat text-[16px] leading-[100%]">Available to stake</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] overflow-hidden"></div>
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">0 WBTC</div>
              </div>
              <div className="w-[115px] h-[40px] flex items-center justify-center gap-[10px]">
                <span className="text-black font-Montserrat text-[16px font-semibold leading-[100%]">Bridge</span>
                <IconArrowSvg className="-rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[30px_21px] flex-wrap">
          <div className="w-[calc((100%_-_42px)_/_3)] rounded-[20px] h-[270px] bg-[#FFFDEB] border border-black drop-shadow-[10px_10px_0px_rgba(0,0,0,0.25]">
            <div className="p-[24px_24px_30px] flex items-center gap-[10px]">
              <div className="w-[60px] h-[60px] rounded-full overflow-hidden"></div>
              <div className="flex flex-col gap-[8px]">
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[100%]">UniBTC</div>
                <div className="flex items-center gap-[3px]">
                  <div className="w-[16px] h-[16px]"></div>
                  <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">Bedrock</div>
                </div>
              </div>
            </div>
            <div className="px-[20px]">
              <div className="mb-[30px] flex items-start justify-between">
                <div className="flex flex-col gap-[7px]">
                  <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">TVL</div>
                  <div className="flex items-center gap-[3px]">
                    <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">4.29K</div>
                    <div className="w-[16px]"></div>
                  </div>
                  <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">$1.12B</div>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">APY</div>
                  <div className="text-[#72A807] font-Montserrat text-[16px] font-semibold leading-[100%]">4.29K</div>
                </div>

                <div className="flex flex-col gap-[7px]">
                  <div className="text-[#737373] font-Montserrat text-[14px] font-medium leading-[100%]">Your Staked</div>
                  <div className="flex items-center gap-[3px]">
                    <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">0.3512</div>
                    <div className="w-[16px]"></div>
                  </div>
                  <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">$1.12B</div>
                </div>
              </div>
              <div className="flex items-center gap-[10px]">
                <div
                  className="flex items-center justify-center flex-1 h-[50px] rounded-[10px] border border-black bg-[#FFDC50] text-black font-Montserrat text-[16px] font-semibold"
                >
                  Stake
                </div>
                <div className="flex items-center justify-center flex-1 h-[50px] rounded-[10px] border border-black bg-white text-black font-Montserrat text-[16px] font-semibold">
                  Unstake
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <StakeModal
        token={checkedToken}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onClose={() => {
          setCheckedToken(null)
        }}
      />
    </div>
  )
})
