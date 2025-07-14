import React, { useEffect, useState } from 'react';
import Tabs from '@/components/tabs';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import { DEFAULT_CHAIN_ID } from '@/configs';
import Markets from '@/sections/Lending/components/markets';
import BorrowModal from '@/sections/Lending/Beraborrow/form';
import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';
import { ActionText } from '../hooks/use-beraborrow';

const BeraborrowData = dynamic(() => import('../datas/beraborrow'));

interface BeraborrowProps {
  dapp?: any;
}

const Beraborrow: React.FC<BeraborrowProps> = (props) => {
  const { dapp } = props;

  const { config } = dapp || {};
  const { basic, networks } = config || {};
  const network = networks?.[DEFAULT_CHAIN_ID + ''] || {};
  const { markets, borrowToken, ...rest } = network;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();
  const prices = usePriceStore(store => store.price);

  const [currentTab, setCurrentTab] = useState<string>('borrow');
  const [loading, setLoading] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [data, setData] = useState<any>();
  const [currentMarket, setCurrentMarket] = useState<any>();
  const [currentType, setCurrentType] = useState<ActionText>();

  const actionDisabled = (record: any) => {
    return {
      deposit: false,
      withdraw: !record.balance || Big(record.balance).lte(0),
    };
  }

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setLoading(isChainSupported);
  }, [isChainSupported, currentTab, address]);

  return (
    <>
      <Tabs
        isCard
        currentTab={currentTab}
        tabs={[
          {
            key: 'borrow',
            label: 'Lend & Borrow',
            children: (
              <Markets
                loading={loading}
                laptopGridCols="grid-cols-[3fr_2fr_2fr_2fr_1fr]"
                className="min-h-[50dvh] max-h-[70dvh] overflow-y-auto"
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
                                  className="w-[30px] h-[30px] rounded-full object-contain object-center"
                                  style={{ marginLeft: i > 0 ? -10 : 0 }}
                                />
                              ))
                            }
                            {
                              token.vault === 'collVaultRouter' && (
                                <img src="/images/lending/vaulted.svg" alt="" width={20} height={20} className="absolute z-[1] right-[-10px] top-[-10px]" />
                              )
                            }
                            {
                              token.linkDapp?.icon && (
                                <img src={token.linkDapp?.icon} alt="" width={20} height={20} className="absolute z-[1] left-[0px] top-[-10px] rounded-full" />
                              )
                            }
                          </div>
                          <div className="font-[600] text-[16px]">{token.symbol}</div>
                        </div>
                      );
                    },
                  },
                  {
                    title: 'Borrowed',
                    dataIndex: 'apyShown',
                    skeletonWidth: 165,
                    render: (text: any, record: any, idx: number) => {
                      return (
                        <div className="flex items-center gap-[5px]">
                          <div className="">{record.borrowedShown}</div>
                          <div className="text-[0.8em]">{record.borrowToken.symbol}</div>
                        </div>
                      );
                    },
                  },
                  {
                    title: 'Balance',
                    dataIndex: 'balanceShown',
                    skeletonWidth: 165,
                    render: (text: any, record: any, idx: number) => {
                      return (
                        <div className="flex items-center gap-[5px]">
                          <div className="">{record.balanceShown}</div>
                          <div className="text-[0.8em]">{record.collToken.symbol}</div>
                        </div>
                      );
                    },
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
                    actionDisabled,
                  },
                ]}
                markets={data?.markets || []}
                onSuccess={() => {
                  
                }}
                onDeposit={(token: any) => {
                  setCurrentType(ActionText.Borrow);
                  setCurrentMarket(token);
                  setVisible(true);
                }}
                onWithdraw={(token: any) => {
                  setCurrentType(ActionText.Repay);
                  setCurrentMarket(token);
                  setVisible(true);
                }}
                actionDisabled={actionDisabled}
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
        type={currentType}
        visible={visible}
        onClose={() => setVisible(false)}
        market={currentMarket}
        borrowToken={borrowToken}
        basic={basic}
        networks={networks}
        network={network}
        onSuccess={() => {
          setLoading(true);
          setVisible(false);
        }}
        {...rest}
      />
    </>
  );
};

export default Beraborrow;