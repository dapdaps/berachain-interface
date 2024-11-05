import { useState, useEffect, useCallback } from 'react';
import useAaveConfigStore from '@/stores/useAaveConfigStore';
import multicallAddresses from '@/configs/contract/multicall';
import useAccount from '@/hooks/use-account';

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
  availableLiquidity: string;
  availableLiquidityUSD: string;
  availableBorrows: any;
  availableBorrowsUSD: any;
}

const useBend = () => {
  const { account, chainId, provider } = useAccount();
  const { network, config, fetchConfig } = useAaveConfigStore();
  const prices = usePriceStore(store => store.price);
  const [multicallAddress, setMulticallAddress] = useState('');
  const [markets, setMarkets] = useState<TokenInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const marketStore = useMarketStore();

  useEffect(() => {
    if (chainId === -1 || !chainId) return;
    setMulticallAddress(multicallAddresses[chainId])
    fetchConfig(chainId);
    marketStore.triggerUpdate()
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
    if (!chainId || !provider) return
    try {
      marketStore.setInitData({
        chainId, account, provider, config, multicallAddress, markets, prices
      })
      marketStore.triggerUpdate()
    } catch (err) {
      console.error('Failed to set initial data:', err);
      setError(err as Error);
    }
  }, [chainId, provider, config, markets, prices]);

  const init = useCallback(async () => {
    if (!chainId || !provider) return

    setIsLoading(true);
    setError(null);

    try {
      await marketStore.getPoolDataProvider();
      await marketStore.getBendSupplyBalance();
      await marketStore.getBendSupply();
      await marketStore.getUserAccountData();
      await marketStore.getUserDebts();
    } catch (error) {
      console.error('init-error', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [chainId, provider, marketStore]);

  useEffect(() => {
    init();
  }, [marketStore.updateCounter, markets, chainId, config]);

  return {
    init,
    markets: marketStore.initData.markets,
    config,
    userAccountData: marketStore.userAccountData,
    isLoading,
    error
  };
};

export default useBend;