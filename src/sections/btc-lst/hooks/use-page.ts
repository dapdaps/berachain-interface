import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import useBedrock from "./use-bedrock";
import useEtherFi from "./use-etherfi";
import Big from "big.js";
import { LstHookResult } from "../constant";
import { Token } from "@/types";

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

export default function usePage() {
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
  function handleBridge() {
    router.push('/bridge')
  }
  return {
    wbtcToken,
    bedrockData,
    selectedToken,
    setSelectedToken,
    totalStakedAmountUsd,
    btcLstComposeDataByHooks,
    handleBridge,
    handleStakeModal,
  }

}