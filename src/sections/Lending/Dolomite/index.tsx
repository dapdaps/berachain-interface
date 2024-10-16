import React, { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import Panel from './Panel';
import dynamic from 'next/dynamic';
import DolomiteConfig from '@/configs/lending/dolomite';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import { useMultiState } from '@/hooks/use-multi-state';
import { numberFormatter } from '@/utils/number-formatter';
import PositionList from '@/sections/Lending/Dolomite/position/list';
import DappIcon from '@/components/dapp-icon';
import { DEFAULT_CHAIN_ID } from '@/configs';
import SwitchNetwork from '@/components/switch-network';
import chains from '@/configs/chains';

const { basic, networks }: any = DolomiteConfig;
const DolomiteData = dynamic(() => import('../datas/dolomite'));

interface LendingModalProps {
}

const LendingModal: React.FC<LendingModalProps> = () => {
  const { address, chainId } = useAccount();
  const { provider } = useProvider();

  const [currentTab, setCurrentTab] = useState<string>('supply');
  const [rateKey, setRateKey] = useState<'APY'|'APR'>('APY');
  const [loading, setLoading] = useState<boolean>(false);
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [state, updateState] = useMultiState<any>({
    yourBalance: '$0.00',
    yourCollateral: '$0.00',
    yourBorrowing: '$0.00',
    earningAPR: '0.00%',
    earningAPY: '0.00%',
    borrowAPR: '0.00%',
    borrowAPY: '0.00%',
    supplyTokens: [],
    borrowTokens: [],
  });

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setLoading(isChainSupported);
  }, [isChainSupported, currentTab]);

  useEffect(() => {
    if (!data) return;
    const { markets, positionList, userTotalBorrowUsd, userTotalCollateralUsd, userTotalSupplyUsd } = data;
    const tokenList = Object.values(markets);
    updateState({
      yourBalance: numberFormatter(userTotalSupplyUsd, 2, true, { prefix: '$', isZeroPrecision: true }),
      yourCollateral: numberFormatter(userTotalCollateralUsd, 2, true, { prefix: '$', isZeroPrecision: true }),
      yourBorrowing: numberFormatter(userTotalBorrowUsd, 2, true, { prefix: '$', isZeroPrecision: true }),
      supplyTokens: tokenList.map((it: any) => ({
        ...it,
        APR: it.lendAPR,
        APY: it.lendAPY,
        balance: it.balance,
        balanceShown: numberFormatter(it.balance, 4, true),
        walletBalance: it.walletBalance,
        walletBalanceShown: numberFormatter(it.walletBalance, 4, true),
      })),
      borrowTokens: tokenList.map((it: any) => ({
        ...it,
        APR: it.borrowAPR,
        APY: it.borrowAPY,
        balance: numberFormatter(it.balance, 4, true),
        walletBalance: numberFormatter(it.walletBalance, 4, true),
      }))
    });
  }, [data]);

  return (
    <div className="mt-[40px]">
      <div className="relative w-[970px] mx-auto">
        <DappIcon
          src="/images/dapps/dolomite.svg"
          alt=""
          name="Dolomite"
          type="Lending"
          style={{
            zIndex: 10,
            top: -70,
          }}
        />
        <Tabs
          currentTab={currentTab}
          tabs={[
            {
              key: 'supply',
              label: 'Balances',
              children: (
                <Panel
                  loading={loading}
                  totalBalanceLabel="Your balance"
                  totalBalance={state.yourBalance}
                  totalRateLabel="Earning"
                  totalRate={state[`earning${rateKey}`]}
                  rateName={`Earning ${rateKey}`}
                  tokens={state.supplyTokens}
                  rateKey={rateKey}
                  setRateKey={setRateKey}
                  CHAIN_ID={DEFAULT_CHAIN_ID}
                  onSuccess={() => {
                    setLoading(true);
                  }}
                />
              )
            },
            {
              key: 'borrow',
              label: 'Borrow',
              children: (
                <PositionList
                  loading={loading}
                  data={data}
                  CHAIN_ID={DEFAULT_CHAIN_ID}
                  onSuccess={() => {
                    setLoading(true);
                  }}
                />
              )
            },
          ]}
          onChange={(key) => setCurrentTab(key as string)}
          className="h-full"
        />
      </div>
      <DolomiteData
        {...networks[DEFAULT_CHAIN_ID + '']}
        {...basic}
        chainId={chainId}
        update={loading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log('dolomite data res: %o', res);
          setData(res);
          setLoading(false);
        }}
      />
      <SwitchNetwork targetChain={chains[DEFAULT_CHAIN_ID]} />
    </div>
  );
};

export default LendingModal;