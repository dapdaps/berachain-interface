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

interface LstConfigItem {
  name: string;
  hookData?: LstHookResult;
  disabled: boolean;
  dappIcon: string;
}

interface DisabledLstItem {
  name: string;
  disabled: true;
  dappIcon: string;
  sourceToken: Token;
  apy: string;
}

export interface EnabledLstItem extends LstHookResult {
  name: string;
  disabled: false;
  dappIcon: string;
  sourceToken: Token;
  targetToken: Token;
  tvl: string;
  tvlUsd: string;
  stakedAmount: string;
  stakedAmountUsd: string;
  apy: string;
}

export type LstItem = DisabledLstItem | EnabledLstItem;

export default memo(function Laptop() {
  const [currentTab, setCurrentTab] = useState("stake")
  const [selectedToken, setSelectedToken] = useState<EnabledLstItem | null>(null)
  const router = useRouter();

  const bedrockData = useBedrock();
  const etherFiData = useEtherFi();

  const lstConfig = useMemo<LstConfigItem[]>(() => [
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

  const btcLstComposeDataByHooks = useMemo<LstItem[]>(() => {
    return lstConfig.map(lst => {
      if (lst.disabled) {
        return {
          name: lst.name,
          disabled: true,
          dappIcon: lst.dappIcon,
          sourceToken: wbtcToken,
          apy: 'Coming Soon'
        } as DisabledLstItem;
      }
      
      const hookData = lst.hookData || {} as LstHookResult;
      
      return {
        ...hookData,
        name: lst.name,
        disabled: false,
        dappIcon: lst.dappIcon,
        apy: 'Soon'
      } as EnabledLstItem;
    });
  }, [lstConfig, wbtcToken]);

  const totalStakedAmountUsd = useMemo(() => {
    return btcLstComposeDataByHooks
      .filter(item => !item.disabled)
      .reduce((total, item) => {
        try {
          const amountUsd = 'stakedAmountUsd' in item
            ? (typeof item.stakedAmountUsd === 'string'
              ? item.stakedAmountUsd
              : String(item.stakedAmountUsd || 0))
            : '0';
          
          return total.plus(Big(amountUsd));
        } catch (e) {
          console.error('Error adding stakedAmountUsd:', e);
          return total;
        }
      }, Big(0));
  }, [btcLstComposeDataByHooks]);

  const handleStakeModal = (data: any) => {
    setSelectedToken(data)
  }

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
                btcLstComposeDataByHooks.filter(v => !v.disabled).map((item, index) => {
                  const enabledItem = item as EnabledLstItem;
                  return (
                    <div key={enabledItem.name} className="flex items-center gap-[12px]">
                      <img src={enabledItem.targetToken.icon} className="w-[36px] h-[36px] rounded-full" />
                      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">
                        {balanceShortFormated(enabledItem.stakedAmount, 3)} {enabledItem.targetToken.symbol}
                      </div>
                    </div>
                  );
                })
              }
            </div>
          </div>

          <div className="w-[305px] flex-shrink-0 flex flex-col gap-4 pl-[27px] border-l border-[rgba(0,0,0,0.2)]">
            <div className="text-black font-Montserrat text-[16px] leading-[100%]">Available to stake</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <img src={wbtcToken.icon} className="w-[36px] h-[36px] overflow-hidden" />
                <div className="text-black font-Montserrat text-[16px] font-semibold lea ding-[100%]">{balanceShortFormated(bedrockData.availableAmount, 3)} WBTC</div>
              </div>
              <div onClick={() => router.push('/bridge')} className="w-[115px] h-[40px] bg-[#FFDC50] border border-black flex items-center justify-center gap-[10px] rounded-[10px] cursor-pointer hover:bg-opacity-50">
                <span className="text-black font-Montserrat text-[16px] font-semibold leading-[100%]">Bridge</span>
                <IconArrowSvg className="-rotate-90" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[30px_21px] flex-wrap">
          {
            btcLstComposeDataByHooks.length && btcLstComposeDataByHooks.map((item, index) => (
              <TokenCard item={item} key={item.name} onClick={() => handleStakeModal(item)}/>
            ))
          }
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
