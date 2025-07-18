import { useEffect, useMemo, useRef, useState } from "react";
import Big from "big.js";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import { usePriceStore } from "@/stores/usePriceStore";

export function useBelong() {
  const { basic, networks }: any = beraborrowConfig;
  const currentNetwork = networks?.[DEFAULT_CHAIN_ID + ''] || {};
  const { leverageMarkets = [] } = currentNetwork;

  // KODI iBERA-wgBERA
  const TARGET_MARKET = leverageMarkets.find((m: any) => m.id === 8);

  const { account, provider, chainId } = useCustomAccount();
  const prices = usePriceStore((store) => store.price);

  const positionRef = useRef<any>(null);

  const [leverage, setLeverage] = useState("1");
  const [currentTab, setCurrentTab] = useState("deposit");
  const [currentMarket] = useState<any>(TARGET_MARKET);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [shareModalOpen, setShareModalOpen] = useState<any>(false);
  const [leverageApy, setLeverageApy] = useState<any>();

  const tabs = useMemo(() => {
    // 0 - deposit, 1 - withdraw, 2 - manage
    const allTabs = [
      {
        value: "deposit",
        label: "Deposit",
        disabled: false,
      },
      {
        value: "withdraw",
        label: "Withdraw",
        disabled: false,
      },
      {
        value: "manage",
        label: "Manage",
        disabled: false,
      },
    ];
    if (Big(leverage || 1).lte(1)) {
      return [allTabs[0], allTabs[1]];
    }
    return [allTabs[0], allTabs[2]];
  }, [leverage]);

  const [currentMarketData] = useMemo(() => {
    if (!data || !data.markets || !data.markets.length) {
      return [];
    }
    return [
      { ...data, ...data.markets[0] },
    ];
  }, [data]);

  const isChainSupported = useMemo(() => {
    if (!chainId) {
      return false;
    }
    const currChain = networks[chainId];
    return !!currChain;
  }, [chainId]);

  useEffect(() => {
    setDataLoading(isChainSupported);
  }, [isChainSupported, account, currentMarket]);

  return {
    currentMarket,
    leverage,
    setLeverage,
    currentTab,
    setCurrentTab,
    tabs,
    TARGET_MARKET,
    account,
    provider,
    chainId,
    prices,
    dataLoading,
    setDataLoading,
    data,
    setData,
    currentMarketData,
    isChainSupported,
    positionRef,
    shareModalOpen,
    setShareModalOpen,
    leverageApy,
    setLeverageApy,
    config: {
      basic,
      networks,
      ...currentNetwork,
    }
  }
}
