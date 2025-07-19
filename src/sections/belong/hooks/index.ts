import { useEffect, useMemo, useRef, useState } from "react";
import Big from "big.js";
import beraborrowConfig from "@/configs/lending/beraborrow";
import { DEFAULT_CHAIN_ID } from "@/configs";
import useCustomAccount from "@/hooks/use-account";
import { usePriceStore } from "@/stores/usePriceStore";
import { UserDenStatus } from "@/sections/Lending/datas/beraborrow/den";

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
  const [collVaultBalance, setCollVaultBalance] = useState<any>();

  const [currentMarketData] = useMemo(() => {
    if (!data || !data.markets || !data.markets.length) {
      return [];
    }
    return [
      { ...data, ...data.markets[0] },
    ];
  }, [data]);

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
        disabled: true,
      },
      {
        value: "manage",
        label: "Manage",
        disabled: true,
      },
    ];
    if (Big(collVaultBalance || 0).gt(0)) {
      allTabs[1].disabled = false;
    }
    if (currentMarketData?.denStatus === UserDenStatus.active) {
      allTabs[2].disabled = false;
    }
    if (allTabs.find((t: any) => t.value === currentTab)?.disabled) {
      setCurrentTab("deposit");
    }
    return allTabs;
  }, [leverage, currentMarketData, collVaultBalance, currentTab]);

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
    collVaultBalance,
    setCollVaultBalance,
    config: {
      basic,
      networks,
      ...currentNetwork,
    }
  }
}
