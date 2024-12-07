import Lendings from '@/configs/lending';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import SwitchTabs from '@/components/switch-tabs';
import LazyImage from '@/components/layz-image';
import Drawer from '@/components/drawer';
import { useSwapToken } from '@/hooks/use-swap-token';
import SwapModal from '@/sections/swap/SwapModal';
import BendActionModal from '@/sections/Lending/Bend/Action';
import DolomiteActionPanelMobile from '@/sections/Lending/components/action-panel/mobile';
import { DEFAULT_CHAIN_ID } from '@/configs';
import dynamic from 'next/dynamic';
import DolomiteConfig from '@/configs/lending/dolomite';
import BeraborrowConfig from '@/configs/lending/beraborrow';
import { useAccount } from 'wagmi';
import { useProvider } from '@/hooks/use-provider';
import { numberFormatter } from '@/utils/number-formatter';
import Big from 'big.js';
import useAddAction from '@/hooks/use-add-action';
import { useRouter } from 'next/navigation';
import useBend from '@/sections/Lending/Bend/hooks/useBend';
import useBendReward from '@/sections/Lending/Bend/hooks/useBendReward';
import Skeleton from 'react-loading-skeleton';
import BendBorrowActionModal from '@/sections/Lending/Bend/SupplyBorrowPanel/actionModal';
import useMarketStore from '@/stores/useMarketStore';
import Dropdown from '@/sections/marketplace/components/dropdown';
import useIsMobile from '@/hooks/use-isMobile';
import CheckBox from '@/components/check-box';
import SearchBox from '@/sections/marketplace/components/searchbox';
import LaptopList from './laptop'
import useClickTracking from '@/hooks/use-click-tracking';
import Pool from '@/sections/Lending/Beraborrow/pool';

const { basic: DolomiteBasic, networks: DolomiteNetworks }: any = DolomiteConfig;
const { basic: BeraborrowBasic, networks: BeraborrowNetworks }: any = BeraborrowConfig;
const DolomiteData = dynamic(() => import('@/sections/Lending/datas/dolomite'));
const BeraborrowData = dynamic(() => import('@/sections/Lending/datas/beraborrow'));

const EarnLending = (props: any) => {
  const {} = props;

  const laptopListRef = useRef<any>();

  const { address, chainId } = useAccount();
  const [swapToken, setSwapToken, handleSwap, protocols] = useSwapToken();
  const { provider } = useProvider();
  const { addAction } = useAddAction("lending");
  const router = useRouter();
  const { markets: bendData, init: bendInit } = useBend();
  const { rewardValue: bendRewardValue} = useBendReward({
    provider,
    account: address,
  });
  const { initData: bendInitData } = useMarketStore();
  const { handleReport } = useClickTracking();
  const honeyInfo = bendInitData.markets.find((market) => market.symbol === 'HONEY');

  const lendingProtocols = useMemo(() => {
    const _protocols = Object.values(Lendings).map((it) => it.basic);
    _protocols.unshift({ name: 'All Protocols' });
    return _protocols;
  }, []);

  const [protocol, setProtocol] = useState(lendingProtocols[0]?.name);
  const [tab, setTab] = useState('Supply');
  const [protocolVisible, setProtocolVisible] = useState(false);
  const [borrowAvailable, setBorrowAvailable] = useState(false);

  const [actionData, setActionData] = useState<any>(null);
  const [actionType, setActionType] = useState<any>(null);
  const [bendVisible, setBendVisible] = useState(false);
  const [bendBorrowVisible, setBendBorrowVisible] = useState(false);
  const [dolomiteVisible, setDolomiteVisible] = useState(false);
  const [beraborrowVisible, setBeraborrowVisible] = useState(false);
  const [dolomiteLoading, setDolomiteLoading] = useState<boolean>(false);
  const [dolomiteData, setDolomiteData] = useState<any>();
  const [beraborrowLoading, setBeraborrowLoading] = useState<boolean>(false);
  const [beraborrowData, setBeraborrowData] = useState<any>();
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [checked, setChecked] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  const isMobile = useIsMobile();

  const tokenList = useMemo(() => {
    const _tokens: any = [];
    // Bend data
    if (bendData) {
      bendData
        .filter((bend: any) => {
          if (tab === 'Borrow') {
            return bend.symbol === 'HONEY';
          }
          return true;
        })
        .forEach((bend: any) => {
          if (checked && tab === 'Supply') {
            if (Big(bend.underlyingBalance || 0).lte(0)) return;
          }
          if (checked && tab === 'Borrow') {
            if (Big(bend.debt || 0).lte(0)) return;
          }

          _tokens.push({
            ...bend,
            address: bend.underlyingAsset,
            protocol: Lendings.Bend.basic,
            inWallet: bend.balance,
            supplyAPR: Big(bend.supplyAPY || 0).times(100).toFixed(2) + '%',
            supply_apr: Big(bend.supplyAPY || 0).times(100).toFixed(2),
            borrowAPR: Big(bend.variableBorrowAPY || 0).times(100).toFixed(2) + '%',
            borrow_apr: Big(bend.variableBorrowAPY || 0).times(100).toFixed(2),
            borrowCapacity: bend.availableBorrows,
            youSupplied: bend.underlyingBalance,
            youBorrowed: bend.debt,
            BGTRewards: bend.symbol === 'HONEY' ? bendRewardValue : '0.00',
          });
        })
    }
    // Dolomite data
    if (dolomiteData) {
      Object.values(dolomiteData.markets).forEach((dolomite: any) => {
        if (checked && tab === 'Supply') {
          if (Big(dolomite.yourLends || 0).lte(0)) return;
        }
        if (checked && tab === 'Borrow') {
          if (Big(dolomite.yourBorrow || 0).lte(0)) return;
        }

        _tokens.push({
          ...dolomite,
          protocol: Lendings.Dolomite.basic,
          inWallet: dolomite.walletBalance,
          supplyAPR: dolomite.lendAPR,
          supply_apr: dolomite.lendAPR.replace(/%$/, ''),
          borrowAPR: dolomite.borrowAPR,
          borrow_apr: dolomite.borrowAPR.replace(/%$/, ''),
          borrowCapacity: '0.00',
          youSupplied: dolomite.yourLends,
          youBorrowed: dolomite.yourBorrow,
          BGTRewards: '0.00',
        });
      });
    }
    // Beraborrow data
    if (beraborrowData?.borrowToken) {
      const { borrowToken: nectToken, markets: beraborrowMarkets } = beraborrowData;
      _tokens.push({
        ...nectToken,
        protocol: Lendings.Beraborrow.basic,
        inWallet: Big(nectToken.walletBalance || 0).times(nectToken.realPrice),
        supplyAPR: nectToken.apy,
        supply_apr: '8.11',
        borrowAPR: '0.00%',
        borrow_apr: '0',
        borrowCapacity: '0.00',
        youSupplied: nectToken.balance,
        youBorrowed: beraborrowMarkets?.map((it: any) => it.borrowed || 0)?.reduce((a: any, b: any) => Big(a).plus(b), 0),
        BGTRewards: '0.00',
      });
    }

    if (protocol === lendingProtocols[0]?.name) return _tokens;

    return _tokens.filter((t: any) => t.protocol.name === protocol);
  }, [protocol, dolomiteData, beraborrowData, tab, checked]);

  const handleAction = (type: any, data: any) => {
    if (data.protocol.name === 'Dolomite' && ['Borrow', 'Repay'].includes(type)) {
      router.push('/lending/dolomite?tab=borrow');
      return;
    }
    if (data.protocol.name === 'Beraborrow' && ['Borrow', 'Repay'].includes(type)) {
      router.push('/lending/beraborrow');
      return;
    }

    setActionType(type);

    if (data.protocol.name === 'Bend' && data.symbol === 'HONEY') {
      setActionData(honeyInfo);
    } else {
      setActionData(data);
    }

    if (data.protocol.name === 'Bend' && ['Borrow', 'Repay'].includes(type)) {
      setBendBorrowVisible(true);
      return;
    }

    if (data.protocol.name === 'Beraborrow') {
      setActionData(data);
    }

    switch (data.protocol.name) {
      case "Bend":
        setBendVisible(true);
        break;
      case "Dolomite":
        setDolomiteVisible(true);
        break;
      case "Beraborrow":
        setBeraborrowVisible(true);
        break;
      default:
        break;
    }
  };

  const handleActionClose = () => {
    setBendVisible(false);
    setBendBorrowVisible(false);
    setDolomiteVisible(false);
    setBeraborrowVisible(false);
    setActionData(null);
    setActionType(null);
  };

  useEffect(() => {
    if (!chainId) {
      return;
    }
    const currChain = DolomiteNetworks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId]);

  useEffect(() => {
    setDolomiteLoading(isChainSupported);
    setBeraborrowLoading(isChainSupported);
  }, [isChainSupported, address]);

  useEffect(() => {
    bendInit();
  }, [chainId, provider]);

  useEffect(() => {
    isMobile && handleReport('1019-002');
  }, [isMobile]);

  return (
    <div className="">
      <div className="flex justify-between items-center md:gap-[30px]">
        {
          !isMobile && (
            <>
              <div className='flex gap-2 items-center p-4'>
                <div className="hidden lg:block font-Montserrat text-[26px] font-bold leading-[23px] text-left">
                  Lending
                </div>
                <SwitchTabs
                  tabs={[
                    { label: 'Supply', value: 'Supply' },
                    { label: 'Borrow', value: 'Borrow' }
                  ]}
                  onChange={(val) => {
                    setTab(val);
                    laptopListRef.current?.setPage(1);
                  }}
                  current={tab}
                  className="w-[196px]"
                  style={{ height: 40, borderRadius: 12 }}
                  cursorStyle={{ borderRadius: 10 }}
                />
              </div>
              <div className="flex items-center gap-2 md:justify-between">
                <div className="flex items-center gap-2">
                    <CheckBox
                          checked={checked}
                          onClick={() => {
                            setChecked(!checked);
                          }}
                    />
                    <div>{tab === 'Supply' ? 'You supplied only' : 'Borrow available only'}</div>
                </div>
                  <Dropdown
                    list={lendingProtocols}
                    value={protocol}
                    onChange={(val) => {
                      setProtocol(val);
                    }}
                    placeholder=""
                  />
                  <SearchBox value={searchVal} onChange={setSearchVal} />
              </div>
            </>
          )
        }

        {
          isMobile && (
            <Dropdown
              list={lendingProtocols}
              value={protocol}
              onChange={(val) => {
                setProtocol(val);
              }}
              placeholder=""
            />
          )
        }
        <SwitchTabs
          tabs={[
            { label: 'Supply', value: 'Supply' },
            { label: 'Borrow', value: 'Borrow' }
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-[196px] hidden md:block"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
      </div>
      {
        !isMobile ? (
          <LaptopList
            ref={laptopListRef}
            loading={dolomiteLoading}
            list={tokenList}
            tab={tab}
            onSuccess={(type: any) => {
              switch (type) {
                case 'Dolomite':
                  setDolomiteLoading(true);
                  break;
                case 'Bend':
                  bendInit();
                  break;
                case 'Beraborrow':
                  setBeraborrowLoading(true);
                  break;
                default:
                  break;
              }
            }}
          />
        ) : (
          <div className="mt-[15px] pb-[80px]">
            {
              !dolomiteLoading && tokenList.map((token: any, index: number) => (
                <div className="flex flex-col items-stretch mb-[12px]" key={index}>
                  <div className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[18px_14px_14px] text-black text-[16px] font-[600]">
                    <div className="flex justify-between items-center gap-[10px]">
                      <div className="flex items-center gap-[12px]">
                        <div className="relative w-[40px] h-[40px]">
                          <LazyImage src={token.icon} width={40} height={40} className="rounded-full" />
                          <LazyImage
                            src={token.protocol.icon}
                            width={20}
                            height={20}
                            containerClassName="rounded-[6px]"
                            containerStyle={{ position: 'absolute', right: 0, bottom: 0 }}
                          />
                        </div>
                        <div className="">
                          <div className="">{token.symbol}</div>
                          <div className="text-[14px] font-[500] m-[5px]">{token.protocol.name}</div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center gap-[10px]">
                        {
                          tab === 'Supply' && (
                            <>
                              <button
                                type="button"
                                className="text-black text-[16px] font-[600] border border-[#373A53] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
                                onClick={() => {
                                  handleSwap(token);
                                }}
                              >
                                Get
                              </button>
                              <button
                                type="button"
                                className="bg-[#FFDC50] flex justify-center items-center text-black text-[16px] font-[600] border border-[#373A53] text-center leading-[30px] h-[32px] w-[32px] rounded-[10px]"
                                onClick={() => handleAction('Deposit', token)}
                                disabled={Big(token.inWallet || 0).lte(0)}
                                style={{ opacity: Big(token.inWallet || 0).lte(0) ? 0.3 : 1 }}
                              >
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 14 14"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M8.02111 8.09214L12.7387 8.09217C13.0934 8.09211 13.381 7.86507 13.3809 7.58523L13.3809 6.55662C13.3809 6.27673 13.0932 6.05045 12.7383 6.05004L8.02104 6.05018L8.02095 1.33277C8.02112 0.977856 7.79426 0.690062 7.51418 0.690237L6.48551 0.690289C6.20591 0.69011 5.97887 0.977726 5.97911 1.33269L5.9792 6.05023L1.26149 6.05032C0.906932 6.05026 0.619081 6.27671 0.619142 6.55666L0.619089 7.58533C0.619091 7.86523 0.906768 8.09221 1.26144 8.09227L5.97921 8.09224L5.97918 12.8093C5.97913 13.1647 6.20581 13.4519 6.48571 13.452L7.51438 13.4519C7.79422 13.4518 8.02108 13.1644 8.02131 12.8097L8.02111 8.09214Z"
                                    fill="black"
                                  />
                                </svg>
                              </button>
                            </>
                          )
                        }
                        {
                          tab === 'Borrow' && (
                            <button
                              type="button"
                              className="bg-[#FFDC50] text-black text-[16px] font-[600] border border-[#373A53] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
                              onClick={() => handleAction('Borrow', token)}
                            >
                              Borrow
                            </button>
                          )
                        }
                      </div>
                    </div>
                    <div className="flex justify-between items-start gap-[10px] mt-[13px]">
                      <div className="">
                        <div className="text-[14px] text-[#3D405A] font-[500]">
                          {tab === 'Supply' ? 'In Wallet' : 'Borrow Capacity'}
                        </div>
                        <div className="mt-[5px]">
                          {tab === 'Supply' ? numberFormatter(token.inWallet, 2, true) : numberFormatter(token.borrowCapacity, 2, true)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[14px] text-[#3D405A] font-[500]">
                          {tab} {token.symbol === "HONEY" ? 'APY' : 'APR'}
                        </div>
                        <div className="mt-[5px]" style={{ color: tab === 'Supply' ? '#0A9D20' : '#F0631D' }}>
                          {tab === 'Supply' ? token.supplyAPR : token.protocol.name ==="Bend" && token.symbol === "HONEY" ? Big(token?.borrowAPY).times(100).toFixed(2) + '%' : token.borrowAPR}
                        </div>
                      </div>
                    </div>
                  </div>
                  {
                    tab === 'Supply' && Big(token.youSupplied || 0).gt(0) && (
                      <Assets tab={tab} token={token} handleAction={handleAction} />
                    )
                  }
                </div>
              ))
            }
            {
              dolomiteLoading && (
                <div className="flex flex-col items-stretch gap-[12px]">
                  <Skeleton width={'100%'} height={146} borderRadius={10} />
                  <Skeleton width={'100%'} height={146} borderRadius={10} />
                  <Skeleton width={'100%'} height={146} borderRadius={10} />
                  <Skeleton width={'100%'} height={146} borderRadius={10} />
                </div>
              )
            }
          </div>
        )
      }

      <Drawer
        visible={protocolVisible}
        size="40vh"
        onClose={() => {
          setProtocolVisible(false);
        }}
      >
        <div className="px-[12px] py-[24px]">
          <div className="font-[600] text-[16px]">Protocols</div>
          <div className="mt-[12px]">
            {
              lendingProtocols.map((p: any, idx: number) => (
                <div
                  key={idx}
                  className="h-[50px] px-[12px] flex items-center justify-between rounded-[10px]"
                  style={{ background: protocol === p.name ? 'rgba(0,0,0,.1)' : '' }}
                  onClick={() => {
                    setProtocolVisible(false);
                    setProtocol(p.name);
                  }}
                >
                  {p.name}
                  {
                    protocol === p.name && (
                      <div className="w-[6px] h-[6px] bg-[#EBF479] rounded-[6px]"></div>
                    )
                  }
                </div>
              ))
            }
          </div>
        </div>
      </Drawer>
      {/*#region swap*/}
      {swapToken && (
        <SwapModal
          defaultOutputCurrency={swapToken}
          outputCurrencyReadonly={true}
          show={!!swapToken}
          protocols={protocols}
          onClose={() => {
            setSwapToken(null);
          }}
        />
      )}
      {/*#endregion*/}
      {/*#region Bend Deposit*/}
      <BendActionModal
        isOpen={bendVisible}
        onClose={handleActionClose}
        action={actionType?.toLowerCase()}
        token={actionData}
      />
      {/*#endregion*/}
      {/*#region Bend Borrow*/}
      <BendBorrowActionModal
        isOpen={bendBorrowVisible}
        onClose={handleActionClose}
        action={actionType?.toLowerCase()}
        token={actionData}
      />
      {/*#endregion*/}
      {/*#region Dolomite Deposit*/}
      <Drawer
        visible={dolomiteVisible}
        onClose={handleActionClose}
        size="50vh"
      >
        <div className="py-[23px]">
          <div className="text-[18px] font-[700] text-black px-[24px]">
            {actionType} {actionData?.symbol}
          </div>
          <DolomiteActionPanelMobile
            title={actionType}
            actionText={actionType}
            placeholder="0.00"
            token={actionData}
            CHAIN_ID={80084}
            onSuccess={() => {
              // reload data
              setDolomiteLoading(true);
            }}
            addAction={addAction}
          />
        </div>
      </Drawer>
      {/*#endregion*/}
      {/*#region Beraborrow Deposit*/}
      <Drawer
        visible={beraborrowVisible}
        onClose={handleActionClose}
        size="60dvh"
      >
        <div className="py-[23px]">
          <div className="text-[18px] font-[700] text-black px-[24px]">
            {actionType} {actionData?.symbol}
          </div>
          <Pool
            className="!bg-transparent !border-0 !shadow-none !rounded-none !w-full !h-min-unset"
            title={actionType}
            actionText={actionType}
            placeholder="0.00"
            token={actionData}
            CHAIN_ID={80084}
            onSuccess={() => {
              // reload data
              setDolomiteLoading(true);
            }}
            addAction={addAction}
          />
        </div>
      </Drawer>
      {/*#endregion*/}
      {/*#region Dolomite data loader*/}
      <DolomiteData
        {...DolomiteNetworks[DEFAULT_CHAIN_ID + '']}
        {...DolomiteBasic}
        chainId={chainId}
        update={dolomiteLoading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log('%cDolomite data res: %o', 'background:#FFDC50;color:#FFF;', res);
          setDolomiteData(res);
          setDolomiteLoading(false);
        }}
      />
      {/*#endregion*/}
      {/*#region Beraborrow data loader*/}
      <BeraborrowData
        {...BeraborrowNetworks[DEFAULT_CHAIN_ID + '']}
        {...BeraborrowBasic}
        chainId={chainId}
        update={beraborrowLoading}
        account={address}
        provider={provider}
        onLoad={(res: any) => {
          console.log('%cBeraborrow data res: %o', 'background:#FFDC50;color:#FFF;', res);
          setBeraborrowData(res);
          setBeraborrowLoading(false);
        }}
      />
      {/*#endregion*/}
    </div>
  );
};

export default EarnLending;

const Assets = (props: any) => {
  const { tab, token, handleAction } = props;

  return (
    <div className="bg-[rgba(0,0,0,0.5)] rounded-[10px] p-[11px_14px_9px] text-white text-[14px] font-[400] flex justify-between items-center gap-[10px]">
      <div className="">
        <div className="">You {tab === 'Supply' ? 'Supplied' : 'Borrowed'}</div>
        <div className="flex items-center gap-[6px] mt-[3px]">
          <LazyImage src={token.icon} width={20} height={20} />
          <div className="text-white text-[16px] font-[600]">
            {tab === 'Supply' ? numberFormatter(token.youSupplied, 2, true) : numberFormatter(token.youBorrowed, 2, true)}
          </div>
        </div>
      </div>
      {
        tab === 'Borrow' && (
          <>
            {
              Big(token.BGTRewards || 0).gt(0) && (
                <div className="">
                  <div className="">BGT Rewards</div>
                  <div className="flex items-center gap-[6px] mt-[3px]">
                    <LazyImage src="/images/icon-coin.svg" width={20} height={20} />
                    <div className="text-white text-[16px] font-[600]">
                      {numberFormatter(token.BGTRewards, 2, true)}
                    </div>
                  </div>
                </div>
              )
            }
            <button
              type="button"
              className="text-white text-[16px] font-[600] border border-[#FFF] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
              onClick={() => handleAction('Repay', token)}
            >
              Repay
            </button>
          </>
        )
      }
      {
        tab === 'Supply' && (
          <button
            type="button"
            className="opacity-50 flex justify-center items-center text-black text-[16px] font-[600] border border-[#FFF] text-center leading-[30px] h-[32px] w-[32px] rounded-[10px]"
            onClick={() => {
              if (tab === 'Supply') {
                handleAction('Withdraw', token);
                return;
              }
            }}
          >
            <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="13" height="2" rx="1" fill="white" />
            </svg>
          </button>
        )
      }
    </div>
  );
};
