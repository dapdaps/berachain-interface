import DappModal from '@/sections/marketplace/components/dapps/modal';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { MarketplaceContext } from '@/sections/marketplace/context';
import SwitchTabs from '@/components/switch-tabs';
import LendingButton from '@/sections/Lending/components/button';
import { useProvider } from '@/hooks/use-provider';
import Link from 'next/link';
import { useHandler } from '@/sections/Lending/hooks/use-handler';
import dynamic from 'next/dynamic';
import { useAccount } from 'wagmi';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';
import CircleLoading from '@/components/circle-loading';

const DolomiteData = dynamic(() => import('@/sections/Lending/datas/dolomite'));
const DolomiteHandler = dynamic(() => import('@/sections/Lending/handlers/dolomite'));

const TABS = [
  {
    value: 'Deposit',
    label: 'Supply',
    disabled: false,
  },
  {
    value: 'Withdraw',
    label: 'Withdraw',
    disabled: false,
  },
];

const Lending = (props: Props) => {
  const {} = props;
  const {
    lendingVisible,
    setLendingVisible,
    lendingData,
  } = useContext(MarketplaceContext);

  const {
    dapp,
    dappLink,
    config,
    networks,
    investToken,
  } = lendingData;

  const { address, chainId } = useAccount();
  const { provider } = useProvider();

  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [data, setData] = useState<any>({});
  const [currentTab, setCurrentTab] = useState(TABS[0].value);

  const balance = useMemo(() => {
    if (currentTab === TABS[0].value) {
      return data.walletBalance;
    }
    return data.balance;
  }, [data, currentTab]);

  const {
    amount,
    disabled,
    loading,
    txData,
    isMax,
    setLoading,
    setTxData,
    setAmount,
    handleAmount,
    handleBalance,
  } = useHandler({ balance: balance });

  const handleClose = () => {
    setLendingVisible(false);
  };

  const handleData = (res: any) => {
    console.log('Dolomite data res: %o', res);
    setDataLoading(false);
    const { markets } = res;
    const currentInvest = markets[investToken?.address.toLowerCase()];
    setData(currentInvest);
  };

  useEffect(() => {
    if (!chainId || !networks) {
      return;
    }
    const currChain = networks[chainId];
    setIsChainSupported(!!currChain);
  }, [chainId, networks]);

  useEffect(() => {
    setDataLoading(isChainSupported);
  }, [isChainSupported, currentTab]);

  return (
    <DappModal
      title={`Invest ${investToken?.symbol}`}
      type="Lending"
      visible={lendingVisible}
      onClose={handleClose}
    >
      <div className="mt-[40px]">
        <SwitchTabs
          tabs={TABS}
          current={currentTab}
          onChange={(current) => {
            setAmount('');
            setCurrentTab(current);
          }}
        />
        <div className="flex justify-between items-start mt-[33px]">
          <div className="flex flex-col gap-[14px]">
            <div className="text-[16px] font-[500] leading-[100%]">
              Earn APY
            </div>
            <div className="text-[20px] font-[700] leading-[normal]">
              {
                dataLoading ? (
                  <Skeleton width={78} height={30} />
                ) : data.lendAPY
              }
            </div>
          </div>
          <div className="flex flex-col gap-[14px] pr-[62px]">
            <div className="text-[16px] font-[500] leading-[100%]">
              Supplied
            </div>
            <div className="text-[20px] font-[700] leading-[normal] flex items-center gap-[3px]">
              {
                dataLoading ? (
                  <Skeleton width={116} height={30} />
                ) : (
                  <>
                    <img src={investToken?.icon} alt="" width={30} height={30} className="rounded-full" />
                    <span className="ml-[3px]">
                      {numberFormatter(data.balance, 2, true)}
                    </span>
                    <span className="font-[500] text-[0.7em]">{investToken?.symbol}</span>
                  </>
                )
              }
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[14px] font-[500] mt-[38px]">
          <span className="pl-[5px]">Deposit</span>
          <span className="whitespace-nowrap pr-[13px] flex items-center">
            <span>Balance:&nbsp;</span>
            {
              dataLoading ? <CircleLoading size={16} /> : (
                <span className="underline decoration-solid" onClick={handleBalance}>
                  {numberFormatter(balance, 2, true)}
                </span>
              )
            }
          </span>
        </div>
        <div className="mt-[12px] relative">
          <input
            type="text"
            disabled={dataLoading}
            className="w-full rounded-[12px] border border-[#373A53] bg-white h-[72px] leading-[70px] pr-[200px] pl-[17px] text-[26px] font-[700]"
            placeholder="0"
            value={amount}
            onChange={handleAmount}
          />
          <div className="absolute flex items-center gap-[8px] right-[16px] top-[50%] translate-y-[-50%]">
            <img src={investToken?.icon} alt="" width={30} height={30} className="rounded-full" />
            <span className="font-[600] text-[16px] whitespace-nowrap">{investToken?.symbol}</span>
          </div>
        </div>
        <div className="mt-[18px]">
          <LendingButton
            type="primary"
            disabled={disabled || dataLoading}
            loading={loading || dataLoading}
            style={{ height: 60, width: '100%' }}
            amount={amount}
            token={data}
            chain={{ chainId }}
            spender={config?.spenderAddress}
            isSkipApproved={currentTab === TABS[1].value}
            isApproveMax={true}
            provider={provider}
            unsignedTx={txData?.unsignedTx}
            gas={txData?.gas}
            config={config}
            onApprovedSuccess={() => {
              setLoading(true);
            }}
            onSuccess={() => {
              setDataLoading(true);
            }}
          >
            {currentTab}
          </LendingButton>
        </div>
        <div className="mt-[16px] flex justify-center items-center text-[14px] text-[#979ABE] font-[400] gap-[4px]">
          <span>Manage exist assets on</span>
          <Link className="text-black underline decoration-solid" href={dappLink}>{dapp}</Link>
        </div>
        <DolomiteData
          {...config}
          chainId={chainId}
          update={dataLoading}
          account={address}
          provider={provider}
          onLoad={handleData}
        />
        <DolomiteHandler
          data={{
            config,
            ...data,
            actionText: currentTab,
          }}
          provider={provider}
          update={loading}
          chainId={chainId}
          account={address}
          amount={isMax ? balance : amount}
          onLoad={(txData: any) => {
            console.log('%cDolomite handler DATA onLoad: %o', 'background: #6439FF; color:#fff;', txData);
            setTxData(txData);
            setLoading(false);
          }}
        />
      </div>
    </DappModal>
  );
};

export default Lending;

interface Props {
}
