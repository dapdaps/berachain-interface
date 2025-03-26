import PageBack from '@/components/back';
import { Token } from '@/types';
import IconArrowSvg from '@public/images/icon-arrow.svg';
import { memo, useMemo, useState } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from './components/token-card';
import useBedrock, { LstHookResult } from './hooks/use-bedrock';
import useEtherFi from './hooks/use-etherfi';

export default memo(function Laptop() {
  const [currentTab, setCurrentTab] = useState("stake")
  const [checkedToken, setCheckedToken] = useState<null | Token>(null)
  const bedrockData = useBedrock();
  const etherFiData = useEtherFi();

  const lstConfig = useMemo(() => [
    { 
      name: 'bedrock', 
      hookData: bedrockData, 
      disabled: false, 
      dappIcon: '/images/lst/bedrock.png' 
    },
    { 
      name: 'etherfi', 
      hookData: etherFiData, 
      disabled: false, 
      dappIcon: '/images/lst/etherfi.png' 
    },
    { name: 'babylon', disabled: true, dappIcon: '/images/lst/babylon.png' },
    { name: 'solv', disabled: true, dappIcon: '/images/lst/solv.png' },
    { name: 'stakestone', disabled: true, dappIcon: '/images/lst/stakestone.png' },
    { name: 'lombard', disabled: true, dappIcon: '/images/lst/lombard.png' },
    { name: 'lorenzo', disabled: true, dappIcon: '/images/lst/lorenzo.png' },
    { name: 'sumer', disabled: true, dappIcon: '/images/lst/sumer.png' },
  ], [bedrockData, etherFiData]);

  const btcLstComposeDataByHooks = useMemo(() => {
    return lstConfig.map(lst => {
      if (lst.disabled) {
        return {
          name: lst.name,
          disabled: true,
          dappIcon: lst.dappIcon,
          apy: 'Coming Soon'
        };
      }
      
      const hookData = lst.hookData as LstHookResult;
      
      return {
        name: lst.name,
        disabled: false,
        dappIcon: lst.dappIcon,
        sourceToken: hookData.sourceToken,
        targetToken: hookData.targetToken,
        tvl: hookData.tvl || 0,
        tvlUsd: hookData.tvlUsd || '0',
        stakedAmount: hookData.stakedAmount || 0,
        stakedAmountUsd: hookData.stakedAmountUsd || '0',
        apy: 'Soon'
      };
    });
  }, [lstConfig]);


  return (
    <div>
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
      <div className="w-[1200px] mx-auto">
        <div className="text-center text-black font-CherryBomb text-[60px] leading-[90%]">BTC LST</div>
        <div className="m-[25px_0_31px] p-[20px_18px_20px_30px] flex justify-between rounded-[20px] h-[110px] bg-[#FFFDEB] border border-black">
          <div className="flex-1 flex flex-col gap-[16px]">
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

          <div className="w-[305px] flex-shrink-0 flex flex-col gap-4 pl-[27px] border-l border-[rgba(0,0,0,0.2)]">
            <div className="text-black font-Montserrat text-[16px] leading-[100%]">Available to stake</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <div className="w-[36px] h-[36px] overflow-hidden"></div>
                <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">0 WBTC</div>
              </div>
              <div className="w-[115px] h-[40px] bg-[#FFDC50] border border-black flex items-center justify-center gap-[10px] rounded-[10px]">
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">Bridge</span>
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
