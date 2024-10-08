import { useState, useEffect, useCallback } from 'react';
import useAaveConfigStore from '@/stores/useAaveConfigStore';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';
import { useProvider } from '@/hooks/use-provider';
import { usePriceStore } from '@/stores/usePriceStore';
import useMarketStore from '@/stores/useMarketStore';

export interface TokenInfo {
  name: string;
  symbol: string;
  icon: string;
  deposited: number;
  inWallet: number;
  depositedValue: string;
  walletValue: string;
  decimals: number;
  tokenPrice: number;
  balance: string;
  balanceInUSD: string;
  underlyingAsset: string;
  underlyingBalance: string;
  underlyingBalanceUSD: string;
  variableDebtTokenAddress: string;
  debt: string;
  debtInUSD: string;
  supplyRewardApy: string;
  borrowAPY: string;
  supplyAPY: string;
  utilized: string;
  aTokenAddress: string;
}

const useBend = () => {
  const { account, chainId } = useAccount();
  const { provider } = useProvider();
  const { network, config, fetchConfig } = useAaveConfigStore();
  const prices = usePriceStore(store => store.price);
  const [multicallAddress, setMulticallAddress] = useState('');
  const [markets, setMarkets] = useState<TokenInfo[]>([]);
  const marketStore = useMarketStore()

  useEffect(() => {
    if (!chainId) return;
    setMulticallAddress(multicallAddresses[chainId])
    fetchConfig(chainId);
  }, [chainId, fetchConfig]);

  useEffect(() => {
    if (!network) return;
    const updatedMarkets = network?.rawMarkets?.map((item: any) => ({
      ...item,
      tokenPrice: prices[item.symbol] || 1
    }));
    setMarkets(updatedMarkets);
    marketStore.triggerUpdate()
  }, [network, prices]);


  useEffect(() => {
    marketStore.setInitData({
      chainId, account, provider, config, multicallAddress, markets, prices
    })
  }, [chainId, account, provider, marketStore.updateCounter]);

  const init = async () => {
    await marketStore.getBendSupplyBalance();
    await marketStore.getBendSupply();
    await marketStore.getUserAccountData();
    await marketStore.getUserDebts();
    await marketStore.getPoolDataProvider();
    await marketStore.calculateNetBaseData();
  };

  useEffect(() => {
    if (!chainId || !markets.length ) return
    init();
  }, [marketStore.updateCounter, markets, chainId]);


  return {
    markets: marketStore.initData.markets,
    config,
    userAccountData: marketStore.userAccountData,
  };
};

export default useBend;