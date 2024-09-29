import React, { useEffect, useState } from 'react';
import Modal from '@/components/modal';
import Tabs from '@/components/tabs';
import Panel from './Panel';
import dynamic from 'next/dynamic';
import DolomiteConfig from '@/configs/lending/dolomite';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import { useMultiState } from '@/hooks/use-multi-state';
import { numberFormatter } from '@/utils/number-formatter';

const { basic, networks }: any = DolomiteConfig;
const DolomiteData = dynamic(() => import('../datas/dolomite'));

interface LendingModalProps {
  open: boolean;
  onClose: () => void;
}

const LendingModal: React.FC<LendingModalProps> = ({ open, onClose }) => {
  const { address, chainId } = useAccount();
  const { provider } = useProvider();

  const [currentTab, setCurrentTab] = useState<string>('supply');
  const [rateKey, setRateKey] = useState<'APY'|'APR'>('APY');
  const [update, setUpdate] = useState<boolean>(false);
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [state, updateState] = useMultiState<any>({
    yourBalance: '$0.00',
    yourCollateral: '$0.00',
    earningAPR: '0.00%',
    earningAPY: '0.00%',
    borrowAPR: '0.00%',
    borrowAPY: '0.00%',
    supplyTokens: [],
    borrowTokens: [],
  });

  const borrowTokens: any = [
    { symbol: 'BERA', name: 'Berachain token', icon: '', apr: '2.15', balance: '50.00', walletBalance: '0.00' },
    { symbol: 'ETH', name: 'Ethereum', icon: '', apr: '3.50', balance: '0.50', walletBalance: '0.00' },
    { symbol: 'USDC', name: 'USD coin', icon: '', apr: '1.50', balance: '100.00', walletBalance: '0.00' },
  ];

  const handleDeposit = (symbol: string) => {
    console.log(`Depositing ${symbol}`);
    // Implement deposit logic
  };

  const handleWithdraw = (symbol: string) => {
    console.log(`Withdrawing ${symbol}`);
    // Implement withdraw logic
  };

  const handleBorrow = (symbol: string) => {
    console.log(`Borrowing ${symbol}`);
    // Implement borrow logic
  };

  const handleRepay = (symbol: string) => {
    console.log(`Repaying ${symbol}`);
    // Implement repay logic
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setUpdate(isChainSupported);
  }, [isChainSupported, currentTab]);

  useEffect(() => {
    if (!data) return;
    const { markets, positionList, userTotalBorrowUsd, userTotalCollateralUsd, userTotalSupplyUsd } = data;
    const tokenList = Object.values(markets);
    updateState({
      yourBalance: numberFormatter(userTotalSupplyUsd, 2, true, { prefix: '$', isZeroPrecision: true }),
      yourCollateral: numberFormatter(userTotalCollateralUsd, 2, true, { prefix: '$', isZeroPrecision: true }),
      supplyTokens: tokenList.map((it: any) => ({
        ...it,
        APR: it.lendAPR,
        APY: it.lendAPY,
        balance: numberFormatter(it.balance, 4, true),
        walletBalance: numberFormatter(it.walletBalance, 4, true),
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
    <Modal open={open} onClose={onClose}>
      <div className="rounded-[20px] w-[970px] h-[490px]">
        <div className="absolute top-0 left-0 right-0">
          <Tabs
            currentTab={currentTab}
            tabs={[
              {
                key: 'supply',
                label: 'Balances',
                children: (
                  <Panel
                    totalBalanceLabel="Your balance"
                    totalBalance={state.yourBalance}
                    totalRateLabel="Earning"
                    totalRate={state[`earning${rateKey}`]}
                    rateName={`Earning ${rateKey}`}
                    tokens={state.supplyTokens}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    rateKey={rateKey}
                    setRateKey={setRateKey}
                  />
                )
              },
              {
                key: 'borrow',
                label: 'Borrow',
                children: (
                  <Panel
                    totalBalanceLabel="Your collateral"
                    totalBalance={state.yourCollateral}
                    totalRateLabel="Net"
                    totalRate={state[`borrow${rateKey}`]}
                    rateName={`Borrow ${rateKey}`}
                    tokens={state.borrowTokens}
                    onDeposit={handleBorrow}
                    onWithdraw={handleRepay}
                    rateKey={rateKey}
                    setRateKey={setRateKey}
                  />
                )
              },
            ]}
            onChange={(key) => setCurrentTab(key as string)}
            className="h-full"
          />
        </div>
        <DolomiteData
          {...networks[chainId + '']}
          {...basic}
          chainId={chainId}
          update={update}
          account={address}
          provider={provider}
          onLoad={(res: any) => {
            console.log('dolomite data res: %o', res);
            setData(res);
            setUpdate(false);
          }}
        />
      </div>
    </Modal>
  );
};

export default LendingModal;