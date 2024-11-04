import Lendings from '@/configs/lending';
import React, { useMemo, useState } from 'react';
import SwitchTabs from '@/components/switch-tabs';
import LazyImage from '@/components/layz-image';
import { beraB } from '@/configs/tokens/bera-bArtio';
import Drawer from '@/components/drawer';
import { useSwapToken } from '@/hooks/use-swap-token';
import SwapModal from '@/sections/swap/SwapModal';
import BendActionModal from '@/sections/Lending/Bend/Action';
import DolomiteActionPanelMobile from '@/sections/Lending/components/action-panel/mobile';
import ActionPanel from '@/sections/Lending/components/action-panel';

const EarnLending = (props: any) => {
  const {} = props;

  const [swapToken, setSwapToken, handleSwap, protocols] = useSwapToken();

  const lendingProtocols = useMemo(() => {
    const _protocols = Object.values(Lendings).map((it) => it.basic);
    _protocols.unshift({ name: 'All Protocols' });
    return _protocols;
  }, []);
  const tokens = useMemo(() => {
    return [
      {
        ...beraB.honey,
        protocol: Lendings.Bend.basic,
        isBGTRewards: true,
      },
      {
        ...beraB.weth,
        protocol: Lendings.Bend.basic,
      },
      {
        ...beraB.wbtc,
        protocol: Lendings.Bend.basic,
      },
      {
        ...beraB.bera,
        protocol: Lendings.Dolomite.basic,
      },
    ];
  }, []);

  const [protocol, setProtocol] = useState(lendingProtocols[0]?.name);
  const [tab, setTab] = useState('Supply');
  const [protocolVisible, setProtocolVisible] = useState(false);
  const [borrowAvailable, setBorrowAvailable] = useState(false);

  const [actionData, setActionData] = useState<any>(null);
  const [actionType, setActionType] = useState<any>(null);
  const [bendVisible, setBendVisible] = useState(false);
  const [dolomiteVisible, setDolomiteVisible] = useState(false);

  const tokenList = useMemo(() => {
    if (protocol === lendingProtocols[0]?.name) return tokens;
    return tokens.filter((t) => t.protocol.name === protocol);
  }, [tokens, protocol]);

  const handleAction = (type: any, data: any) => {
    setActionType(type);
    const bendData = {
      id: '3',
      underlyingAsset: data.address,
      icon: data.icon,
      decimals: data.decimals,
      symbol: data.symbol,
      name: data.name,
      supplyAPY: '',
      usageAsCollateralEnabled: true,
      borrowingEnabled: false,
      aTokenAddress: '0x8Ce5C1c42CD58B7aE61512790e514a82d84375Ed',
      isIsolated: false,
      availableLiquidity: '0',
      availableLiquidityUSD: '0',
      supportPermit: false,
      LTV: 0,
      tokenPrice: '2458.9',
      balance: '0.002125504147946359',
      balanceInUSD: '5.2264021493853021451',
      underlyingBalance: '',
      underlyingBalanceUSD: '',
      availableBorrowsUSD: '0',
      availableBorrows: '0'
    };
    const dolomiteData  = {
      APR: "85.00%",
      APY: "133.73%",
      Utilization: "101.88%",
      address: data.address,
      balance: "1.0938429340596677",
      balanceShown: "1.0938",
      borrowAPR: "100.00%",
      borrowAPY: "171.46%",
      borrowInterest: "1.297930638822485538",
      borrowPar: "19416173511.132751422910166773",
      borrowToken: [],
      borrowTokenPrice: [
        '6.810000000000000000',
        '1.000000000000000000',
        '1',
        '68217.702512321003738700',
        '0.000000000000000001'
      ],
      chainId: 80084,
      color: "#f5f5f4",
      currentTokenBorrow: 0,
      currentTokenBorrowUsd: 0,
      currentTokenCollateral: 0,
      currentTokenCollateralUsd: 0,
      dapp: "Dolomite",
      decimals: data.decimals,
      dolomiteBalance: "1.0938429340596677",
      exchangeRate: "1",
      icon: "/assets/tokens/wbera.svg",
      interestRates: {
        token: {},
        interestSetter: '0xe4d3450d52edf515433fec12eaefffbfa83250b9',
        lowerOptimalRate: '0.140000000000000000',
        upperOptimalRate: '0.860000000000000000',
        optimalUtilizationRate: '0.900000000000000000'
      },
      isBorrowingDisabled: false,
      lendAPR: "85.00%",
      lendAPY: "133.73%",
      liquidationFee: "0.050000000000000000",
      liquidationRatio: "1.249999999999999999",
      liquidationRewardPremium: "0",
      loanToValue: "80",
      marginPremium: "0.086956521739130434",
      marketId: "1",
      maxLTV: "0.8",
      name: data.name,
      oracle: "0x5231c38d2d0716439a48b67590564d87d48da12d",
      price: "6.810000000000000000",
      supplyInterest: "1.248094963919446625",
      supplyMaxWei: null,
      supplyPar: "19817125230.927906164688066283",
      symbol: data.symbol,
      totalBorrowUsd: "171617764588.67865523875466592123859973431188263194",
      totalBorrowed: "25200846488.792754073238570619858825217960628874",
      totalSupplied: "24733654200.082120411062832935461569250680644875",
      totalSupplyUsd: "168436185102.55923999933789229049328659713519159875",
      underlyingPrice: "6.810000000000000000",
      underlyingToken: data,
      userUnderlyingBalance: "0.5",
      walletBalance: "0.5",
      walletBalanceShown: "0.5",
      yourBorrow: "0.000000",
      yourBorrowShares: 0,
      yourBorrowUSD: "0.00",
      yourCollateral: "0.210891",
      yourCollateralUSD: "1.44",
      yourLends: "1.0938429340596677",
      yourLendsUSD: "7.449070380946337037"
    };
    switch (data.protocol.name) {
      case "Bend":
        setActionData(bendData);
        setBendVisible(true);
        break;
      case "Dolomite":
        setActionData(dolomiteData);
        setDolomiteVisible(true);
        break;
      default:
        break;
    }
  };

  const handleActionClose = () => {
    setBendVisible(false);
    setDolomiteVisible(false);
    setActionData(null);
    setActionType(null);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center gap-[30px]">
        <div
          onClick={() => {
            setProtocolVisible(true);
          }}
          className="h-[32px] flex justify-center items-center gap-[14px] text-black text-[14px] font-[500] px-[12px] border border-[#373A53] bg-white rounded-[10px]"
        >
          <div className="whitespace-nowrap">{protocol}</div>
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 1L7 5.8L1 0.999999" stroke="black" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <SwitchTabs
          tabs={[
            { label: 'Supply', value: 'Supply' },
            { label: 'Borrow', value: 'Borrow' }
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-[196px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
      </div>
      {
        tab === 'Borrow' && (
          <div className="flex items-center justify-end gap-[11px] mt-[18px]">
            <div className="text-black text-[14px]">Borrow available only</div>
            <div
              className="w-[20px] h-[20px] rounded-[6px] bg-white border border-black] flex justify-center items-center p-[2px]"
              onClick={() => {
                setBorrowAvailable(!borrowAvailable);
              }}
            >
              {
                borrowAvailable && (
                  <div className="w-full h-full rounded-[5px] bg-[#FFDC50]"></div>
                )
              }
            </div>
          </div>
        )
      }
      <div className="mt-[15px] pb-[80px]">
      {
        tokenList.map((token: any, index) => (
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
                        onClick={() => {}}
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
                  234.51
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[14px] text-[#3D405A] font-[500]">
                    {tab} APR
                  </div>
                  <div className="mt-[5px]" style={{ color: tab === 'Supply' ? '#0A9D20' : '#F0631D' }}>
                    1.14%
                  </div>
                </div>
              </div>
            </div>
            {/*<div className="bg-[rgba(0,0,0,0.5)] rounded-[10px] p-[11px_14px_9px] text-white text-[14px] font-[400] flex justify-between items-center gap-[10px]">
              <div className="">
                <div className="">You {tab === 'Supply' ? 'Supplied' : 'Borrowed'}</div>
                <div className="flex items-center gap-[6px] mt-[3px]">
                  <LazyImage src={token.icon} width={20} height={20} />
                  <div className="text-white text-[16px] font-[600]">10.23</div>
                </div>
              </div>
              {
                tab === 'Borrow' && (
                  <>
                    {
                      token.isBGTRewards && (
                        <div className="">
                          <div className="">BGT Rewards</div>
                          <div className="flex items-center gap-[6px] mt-[3px]">
                            <LazyImage src="/images/icon-coin.svg" width={20} height={20} />
                            <div className="text-white text-[16px] font-[600]">0.23</div>
                          </div>
                        </div>
                      )
                    }
                    <button
                      type="button"
                      className="text-white text-[16px] font-[600] border border-[#FFF] text-center leading-[30px] h-[32px] px-[15px] rounded-[10px]"
                      onClick={() => {
                      }}
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
            </div>*/}
          </div>
        ))
      }
      </div>
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
            onSuccess={() => {}}
            addAction={() => {}}
          />
        </div>
      </Drawer>
      {/*#endregion*/}
    </div>
  );
};

export default EarnLending;
