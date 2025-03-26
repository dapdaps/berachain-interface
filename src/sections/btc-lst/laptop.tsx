import PageBack from '@/components/back';
import { Token } from '@/types';
import IconArrowSvg from '@public/images/icon-arrow.svg';
import { memo, useState } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from './components/token-card';

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
          <TokenCard />
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
