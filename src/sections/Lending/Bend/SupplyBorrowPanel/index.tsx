import React, { useState } from 'react';

import NetBase from '../NetBase';
import useMarketStore from '@/stores/useMarketStore';
import ActionModal from './actionModal/index';
import DepositAction from '../Action';
import Big from 'big.js';
import useBendReward from '../hooks/useBendReward';
import Loading from '@/components/loading';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import useIsMobile from '@/hooks/use-isMobile';

const SupplyBorrowPanel: React.FC = () => {
  const isMobile = useIsMobile();

  const {
    userAccountData,
    initData: { markets, config, provider, account },
    netBaseData
  } = useMarketStore();

  const { rewardValue, claim, claiming} = useBendReward({
    provider, account
  });

  const honeyInfo = markets.find((market) => market.symbol === 'HONEY');

  const [actionVisible, setActionVisible] = useState<any>(false);
  const [actionVisibleBorrow, setActionVisibleBorrow] = useState<any>(false);
  const [actionType, setActionType] = useState<any>();
  const [actionData, setActionData] = useState<any>();
  const handleAction = (action: string) => {
    if (action === 'swap' || !isMobile) return;
    setActionType(action);
    setActionData(honeyInfo);
    if (['borrow', 'repay'].includes(action)) {
      setActionVisibleBorrow(true);
    } else {
      setActionVisible(true);
    }
  };
  const handleActionClose = () => {
    setActionVisible(false);
    setActionVisibleBorrow(false);
    setActionData(void 0);
    setActionType(void 0);
  };

  function formatPercent(apy?: string): string {
    if (!apy) return '0%';
    let formatted = (parseFloat(apy) * 100).toFixed(2);
    formatted = parseFloat(formatted).toString();
    return `${formatted}%`;
  }

  const formatNumber = (num: any) => {
    if (Big(num).eq(0)) {
      return '0';
    }
    if (Big(num).lt(0.01)) {
      return '<0.01';
    }
    return Big(num).toFixed(2);
  }

  console.log('markets', markets);
  console.log('userAccountData', userAccountData);
  console.log('netBaseData', netBaseData);
  

  return (
    <div className='mb-5 md:max-h-[calc(100vh_-_200px)] md:pb-[80px] md:overflow-y-auto'>
      <NetBase />
      <div className='flex md:flex-col gap-[26px] mt-10 h-[380px] md:h-[unset]'>
        <div className='bg-black bg-opacity-[0.06] w-1/2 md:w-full rounded-[10px] p-5 md:p-[20px_16px_13px]'>
          <p className='font-montserrat text-sm font-medium leading-[17px] my-5 md:my-[0] text-[#3D405A]'>
            Honey only earns Interest. <span className="md:font-[600]">It cannot be userd as collateral to borrow more HONEY</span>
          </p>
          <div className='flex flex-col md:flex-row md:gap-[10px] items-center mt-[46px] md:mt-[13px] mb-11 md:mb-[19px]'>
            <div className='w-12 h-12 mb-2'>
              <img src='/images/dapps/honey.png'></img>
            </div>
            <span className='font-montserrat text-lg font-bold leading-[16px]'>
              HONEY
            </span>
          </div>
          <div className='flex justify-around md:justify-between'>
            <div className='flex flex-col items-center md:items-start'>
              <span className='font-montserrat text-base font-medium leading-4 text-black'>
                Supplied
              </span>
              <span className='font-montserrat text-xl font-semibold leading-5 text-black mt-1'>
                {formatNumber(honeyInfo?.underlyingBalance || 0)}
              </span>
            </div>
            <div className='flex flex-col items-center md:items-start'>
              <span className='font-montserrat text-base font-medium leading-4 text-black'>
                Earn APY
              </span>
              <span className='font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1'>
                {formatPercent(honeyInfo?.supplyAPY)}
              </span>
            </div>
          </div>
          <div className='flex space-x-[14px] mt-[35px] md:mt-[18px] relative md:justify-between'>
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.TopLeft}
              content={isMobile ? null : (
                <DepositAction action="supply" token={honeyInfo} />
              )}
              triggerContainerClassName="flex-1"
            >
              <button
                disabled={!provider}
                onClick={() => handleAction('supply')}
                className="w-[192px] md:w-full h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30"
              >
                Supply
              </button>
            </Popover>
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.TopLeft}
              content={isMobile ? null : (
                <DepositAction action="withdraw" token={honeyInfo} />
              )}
              triggerContainerClassName="flex-1"
            >
              <button
                disabled={!provider}
                onClick={() => handleAction('withdraw')}
                className="w-[192px] md:w-full h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30"
              >
                Withdraw
              </button>
            </Popover>
          </div>
        </div>
        <div className='bg-black bg-opacity-[0.06] w-1/2 md:w-full rounded-[10px] p-5 md:p-[20px_16px_13px]'>
          <p className='font-montserrat text-sm font-medium leading-[17px] my-5 md:my-[0] text-[#3D405A]'>
            HONEY that can be borrowed against your deposited collateral
          </p>
          <p className='font-montserrat text-sm font-medium leading-[17px] my-[14px] text-black'>
            Your borrow capacity used
          </p>
          <div className='flex items-center md:mt-[13px] mb-6 md:mb-[19px]'>
            <div className='w-12 h-12 mr-3'>
              <img src='/images/dapps/honey.png'></img>
            </div>
            <span className='font-montserrat text-lg font-bold leading-[16.2px] text-left'>
              {formatNumber(netBaseData?.yourTotalBorrow || 0)}/
              {formatNumber(Big(userAccountData?.availableBorrowsBaseUSD || 0).plus(netBaseData?.yourTotalBorrow || 0).toString())}
            </span>
          </div>
          <div className='flex justify-between'>
            <div className='flex flex-col items-center md:items-start'>
              <span className='font-montserrat text-base font-medium leading-4 text-black mb-3'>
                BGT APY
              </span>
              <span className='font-montserrat text-xl font-semibold leading-5 text-[#7EA82B] mt-1'>
                0%
              </span>
            </div>

            <div className='flex flex-col items-center md:items-start'>
              <span className='font-montserrat text-base font-medium leading-4 text-black mb-3'>
                Borrow APY
              </span>
              <span className='font-montserrat text-xl font-semibold leading-5 text-[#FF6B6B] mt-1'>
                {formatPercent(honeyInfo?.borrowAPY)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-5">
            <span className="font-montserrat text-base font-medium leading-4 text-black">
              Your BGT rewards
            </span>
            <div className="flex items-center justify-end">
              <div className="w-5 h-5 bg-yellow-400 rounded-full mr-2">
                <img
                  src="/images/icon-coin.svg"
                  alt="bgt"
                  className="w-full h-full"
                />
              </div>
              <span className="font-montserrat text-base font-medium leading-4 text-black">
                {rewardValue ?? 0} BGT
              </span>
            </div>
            <button
              className="font-montserrat text-base font-semibold leading-4 text-[#7EA82B] underline md:hidden"
              onClick={claim}
            >
              {claiming ? <Loading /> : 'Claim'}
            </button>
          </div>
          <div className="justify-end mt-[10px] hidden md:flex">
            <button
              className="font-montserrat text-base font-semibold leading-4 text-[#7EA82B] underline"
              onClick={claim}
            >
              {claiming ? <Loading /> : 'Claim'}
            </button>
          </div>
          <div className="flex space-x-[14px] mt-5 relative md:justify-between">
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.TopRight}
              content={isMobile ? null : (
                <ActionModal action="borrow" token={honeyInfo} />
              )}
              triggerContainerClassName="flex-1"
            >
              <button
                disabled={!provider}
                onClick={() => handleAction('borrow')}
                className="w-[192px] md:w-full h-[50px] rounded-[10px] border border-black bg-[#FFDC50] font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30"
              >
                Borrow
              </button>
            </Popover>
            <Popover
              trigger={PopoverTrigger.Click}
              placement={PopoverPlacement.TopRight}
              content={isMobile ? null : (
                <ActionModal action="repay" token={honeyInfo} />
              )}
              triggerContainerClassName="flex-1"
            >
              <button
                onClick={() => handleAction('repay')}
                className="w-[192px] md:w-full h-[50px] rounded-[10px] border border-black bg-white font-montserrat text-base font-medium leading-4 text-center disabled:opacity-30"
                disabled={
                  Big(userAccountData.totalDebtBaseUSD || 0).eq(0) || !provider
                }
              >
                Repay
              </button>
            </Popover>
          </div>
        </div>
      </div>
      <DepositAction
        isOpen={actionVisible}
        onClose={handleActionClose}
        action={actionType}
        token={actionData}
      />
      <ActionModal
        isOpen={actionVisibleBorrow}
        onClose={handleActionClose}
        action={actionType}
        token={actionData}
      />
    </div>
  );
};

export default SupplyBorrowPanel;
