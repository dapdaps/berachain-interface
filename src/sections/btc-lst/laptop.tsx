import PageBack from '@/components/back';
import { Token } from '@/types';
import IconArrowSvg from '@public/images/icon-arrow.svg';
import { memo, useMemo, useState } from "react";
import StakeModal from "./components/stake-modal";
import TokenCard from './components/token-card';
import useBedrock from './hooks/use-bedrock';
import useEtherFi from './hooks/use-etherfi';
import { LstHookResult } from './constant';
import Big from 'big.js';
import { balanceShortFormated, valueFormated } from "@/utils/balance";
import { useRouter } from 'next/navigation';

export default memo(function Laptop() {
  const [currentTab, setCurrentTab] = useState("stake")
  const [checkedToken, setCheckedToken] = useState<null | Token>(null)
  const router = useRouter();


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
    { name: 'pumpBTC', disabled: true, dappIcon: '/images/lst/pumpBTC.png' },
    { name: 'solv', disabled: true, dappIcon: '/images/lst/solv.png' },
    { name: 'stakestone', disabled: true, dappIcon: '/images/lst/stakestone.png' },
    { name: 'lombard', disabled: true, dappIcon: '/images/lst/lombard.png' },
  ], [bedrockData, etherFiData]);

  const wbtcToken = useMemo(() => {
    return bedrockData?.sourceToken
  }, [bedrockData]);

  const btcLstComposeDataByHooks = useMemo(() => {
    return lstConfig.map(lst => {
      if (lst.disabled) {
        return {
          name: lst.name,
          disabled: true,
          dappIcon: lst.dappIcon,
          sourceToken: wbtcToken,
          apy: 'Coming Soon'
        };
      }
      
      const hookData = lst.hookData || {} as LstHookResult;
      
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

  const totalStakedAmountUsd = useMemo(() => {
    return btcLstComposeDataByHooks
      .filter(item => !item.disabled)
      .reduce((total, item) => {
        try {
          const amountUsd = typeof item.stakedAmountUsd === 'string' 
            ? item.stakedAmountUsd 
            : String(item.stakedAmountUsd || 0);
          
          return total.plus(Big(amountUsd));
        } catch (e) {
          console.error('Error adding stakedAmountUsd:', e);
          return total;
        }
      }, Big(0));
  }, [btcLstComposeDataByHooks]);

  return (
    <div>
      <PageBack className="absolute left-[36px] top-[31px]" showBackText={false} />
      <div className="w-[1200px] mx-auto">
        <div className="text-center text-black font-CherryBomb text-[60px] leading-[90%]">BTC LST</div>
        <div className="m-[25px_0_31px] p-[20px_18px_20px_30px] flex justify-between rounded-[20px] h-[110px] bg-[#FFFDEB] border border-black">
          <div className="flex-1 flex flex-col gap-[16px]">
            <div className="flex items-center gap-[10px]">
              <div className="text-black font-Montserrat text-[16px] leading-[100%]">Your Staked</div>
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">${balanceShortFormated(totalStakedAmountUsd.toString())}</div>
            </div>
            <div className="flex items-center gap-[45px]">
              {
                btcLstComposeDataByHooks.filter(v => !v.disabled).map((item, index) => (
                  <div className="flex items-center gap-[12px]">
                    <img src={item?.targetToken?.icon} className="w-[36px] h-[36px] rounded-full" />
                    <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">{item.stakedAmount} {item.targetToken?.symbol}</div>
                  </div>
                ))
              }
            </div>
          </div>

          <div className="w-[305px] flex-shrink-0 flex flex-col gap-4 pl-[27px] border-l border-[rgba(0,0,0,0.2)]">
            <div className="text-black font-Montserrat text-[16px] leading-[100%]">Available to stake</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <img src={wbtcToken.icon} className="w-[36px] h-[36px] overflow-hidden" />
                <div className="text-black font-Montserrat text-[16px] font-semibold lea ding-[100%]">{valueFormated(bedrockData.availableAmount)} WBTC</div>
              </div>
              <div onClick={() => router.push('/bridge')} className="w-[115px] h-[40px] bg-[#FFDC50] border border-black flex items-center justify-center gap-[10px] rounded-[10px]">
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">Bridge</span>
                <IconArrowSvg className="-rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[30px_21px] flex-wrap">
          {
            btcLstComposeDataByHooks.length && btcLstComposeDataByHooks.map((item, index) => (
              <TokenCard item={item} key={item.name} />
            ))
          }
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
