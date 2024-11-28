import React, { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import { useMultiState } from '@/hooks/use-multi-state';
import { numberFormatter } from '@/utils/number-formatter';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Markets from '@/sections/Lending/components/markets';
import BorrowModal from '@/sections/Lending/Beraborrow/form';
import { usePriceStore } from '@/stores/usePriceStore';

const BeraborrowData = dynamic(() => import('../datas/beraborrow'));

interface BeraborrowProps {
  dapp?: any;
}

const Beraborrow: React.FC<BeraborrowProps> = (props) => {
  const { dapp } = props;

  const { config } = dapp || {};
  const { basic, networks } = config || {};
  const { markets, collVaultRouter, borrowToken } = networks?.[DEFAULT_CHAIN_ID + ''] || {};

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const prices = usePriceStore(store => store.price);

  const [currentTab, setCurrentTab] = useState<string>('borrow');
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [currentMarket, setCurrentMarket] = useState<any>();

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

  return (
    <>
      <Tabs
        isCard
        currentTab={currentTab}
        tabs={[
          {
            key: 'borrow',
            label: 'Borrow',
            children: (
              <Markets
                loading={loading}
                laptopGridCols="grid-cols-[3fr_2fr_2fr_2fr_1fr]"
                columns={[
                  {
                    title: 'Token',
                    dataIndex: 'token',
                    type: 'assets',
                    skeletonWidth: 248,
                    render: (text: any, token: any, idx: number) => {
                      return (
                        <div className="flex items-center space-x-[12px]" key={idx}>
                          <div className="flex items-center relative">
                            {
                              token.underlyingTokens.map((t: any, i: number) => (
                                <img
                                  src={t.icon}
                                  alt={t.symbol}
                                  className="w-[30px] h-[30px]"
                                  style={{ marginLeft: i > 0 ? -10 : 0 }}
                                />
                              ))
                            }
                            {
                              token.vault === collVaultRouter && (
                                <img src="/images/lending/vaulted.svg" alt="" width={20} height={20} className="absolute z-[1] right-[-10px] top-[-10px]" />
                              )
                            }
                          </div>
                          <div className="font-[600] text-[16px]">{token.symbol}</div>
                        </div>
                      );
                    },
                  },
                  {
                    title: 'APY',
                    dataIndex: 'apy',
                    skeletonWidth: 165,
                  },
                  {
                    title: 'Balance',
                    dataIndex: 'balanceShown',
                    skeletonWidth: 165,
                  },
                  {
                    title: 'In Wallet',
                    dataIndex: 'walletBalanceShown',
                    skeletonWidth: 165,
                  },
                  {
                    title: '',
                    dataIndex: 'action',
                    type: 'action',
                    skeletonWidth: 82,
                  },
                ]}
                markets={data?.markets || []}
                onSuccess={() => {}}
                onDeposit={(token: any) => {
                  setCurrentMarket(token);
                  setVisible(true);
                }}
                onWithdraw={() => {}}
              />
            )
          },
        ]}
        onChange={(key) => setCurrentTab(key as string)}
        className="h-full md:pt-[20px]"
      />
      <BeraborrowData
        {...networks[DEFAULT_CHAIN_ID + '']}
        {...basic}
        chainId={chainId}
        prices={prices}
        update={loading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log('Beraborrow data res: %o', res);
          setData(res);
          setLoading(false);
        }}
      />
      <BorrowModal
        visible={visible}
        onClose={() => setVisible(false)}
        market={currentMarket}
        borrowToken={borrowToken}
      />
    </>
  );
};

export default Beraborrow;