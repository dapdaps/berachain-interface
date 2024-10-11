import DappModal from '@/sections/marketplace/components/dapps/modal';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import SwitchTabs from '@/components/switch-tabs';

import Link from 'next/link';
import { useAccount } from 'wagmi';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';
import CircleLoading from '@/components/circle-loading';
import useMarketStore from '@/stores/useMarketStore';

import { useDepositAndWithdraw } from '@/sections/Lending/Bend/useDepositAndWithdraw';
import Big from 'big.js';
import BendingButton from './bendButton';
import GAS_LIMIT_RECOMMENDATIONS from '@/configs/gas-limit';

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

const BendLending = (props: Props) => {
  const {} = props;
  const [lendingVisible, setLendingVisible] = useState(true);
  const { userAccountData, triggerUpdate, initData: { markets, config, provider } } = useMarketStore()

  const { address, chainId } = useAccount();
  const [isChainSupported, setIsChainSupported] = useState<boolean>(false);

  const [currentTab, setCurrentTab] = useState(TABS[0].value);
  
  const [disabled, setDisabled] = useState(false);
  const [gas, setGas] = useState<any>(0);
  const [dataLoading, setDataLoading] = useState(false);
  const honeyInfo = markets.find((market) => market.symbol === "HONEY");
  
  const balance = useMemo(() => {
    if (!honeyInfo) return 0;
    if (currentTab === TABS[0].value) {
      return honeyInfo.balance;
    }
    return honeyInfo.underlyingBalance;
  }, [honeyInfo, currentTab, markets]);

  const {
    loading, 
    approving,
    handleApprove,
    depositErc20,
    withdrawErc20,
    needApprove,
    setAmount,
    amount
  } = useDepositAndWithdraw({
    token: honeyInfo,
    isDeposit: currentTab === TABS[0].value,
    config, triggerUpdate
  });

  useEffect(() => {
    if (!amount || Big(amount).lte(0)) {
      setDisabled(true);
      return;
    }
    if (Big(amount).gt(balance)) {
      setDisabled(true);
      return;
    }
    setDisabled(false);
  }, [amount, balance]);

  const handleClose = () => {
    setLendingVisible(false);
  };

  const handleAmount = (e: any ) => {
    if (isNaN(Number(e.target.value))) return;
    
    if (Number(e.target.value) >= Number(balance)) {
      setAmount(balance);
      return;
    }
    
    setAmount(e.target.value.replace(/\s+/g, ''));
  }

  function formatPercent(apy?: string): string {
    if (!apy) return "0%";
    let formatted = (parseFloat(apy) * 100).toFixed(2);
    formatted = parseFloat(formatted).toString();
    return `${formatted}%`;
  }

  const gasEstimation = useCallback((action: any) => {
    const assetsToSupply = [...markets];

    if (!assetsToSupply) {
      return Promise.resolve('-');
    }

    if(!honeyInfo) return Promise.resolve('-');

    const { tokenPrice, decimals } = honeyInfo;
    return provider
      .getGasPrice()
      .then((gasPrice: any) => {
        const gasLimit = GAS_LIMIT_RECOMMENDATIONS[action].limit;
        return setGas(Big(gasPrice.toString()).mul(gasLimit).div(Big(10).pow(decimals)).mul(tokenPrice || 1).toFixed(2));
      })
      .catch((err: any) => {
        console.log('gasEstimation error', err);
      });
  }, [markets]);

  useEffect(() => {
    gasEstimation(currentTab === TABS[0].value ? 'deposit' : 'withdraw');
  }, [currentTab, gasEstimation]);

  const handleAction = async () => {
    if (!amount || Big(amount).lte(0) || !honeyInfo) {
      return;
    }
    const value = Big(amount).mul(Big(10).pow(honeyInfo.decimals)).toFixed(0);
    
    if (currentTab === TABS[0].value) {
      await depositErc20(value);
    } else {
      await withdrawErc20(value);
    }
  }
  
  useEffect(() => {
    if (!markets || !userAccountData) return setDataLoading(true);
    setDataLoading(false);
  }, [markets, userAccountData] )

  if (!honeyInfo) return null;

  return (
    <DappModal
      title={`Invest ${honeyInfo?.symbol}`}
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
                ) : formatPercent(honeyInfo?.supplyAPY)
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
                    <img src={honeyInfo?.icon} alt="" width={30} height={30} className="rounded-full" />
                    <span className="ml-[3px]">
                      {numberFormatter(honeyInfo?.underlyingBalance, 2, true)}
                    </span>
                    <span className="font-[500] text-[0.7em]">{honeyInfo?.symbol}</span>
                  </>
                )
              }
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center text-[14px] font-[500] mt-[38px]">
          <span className="pl-[5px]">{ currentTab === TABS[0].value ? 'Deposit' : 'Withdraw' }</span>
          <span className="whitespace-nowrap pr-[13px] flex items-center">
            <span>Balance:&nbsp;</span>
            {
              dataLoading ? <CircleLoading size={16} /> : (
                <span className="underline decoration-solid" onClick={() => setAmount(balance)}>
                  {honeyInfo ? numberFormatter(balance, 2, true) : '-'}
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
            <img src={honeyInfo?.icon} alt="" width={30} height={30} className="rounded-full" />
            <span className="font-[600] text-[16px] whitespace-nowrap">{honeyInfo?.symbol}</span>
          </div>
        </div>
        <div className="mt-[18px]">
          <BendingButton
            chain={{ chainId }}
            config={config}
            token={honeyInfo}
            approved={needApprove}
            approving={approving}
            gas={gas}
            provider={provider}
            style={{ height: 60, width: '100%' }}
            type="primary"
            amount={amount}
            approve={() => {
              const value = Big(amount).mul(Big(10).pow(honeyInfo.decimals)).toFixed(0);
              handleApprove(value)
            }}
            disabled={disabled}
            loading={loading}
            onClick={handleAction}
          >
            {currentTab}
          </BendingButton>
        </div>
        <div className="mt-[16px] flex justify-center items-center text-[14px] text-[#979ABE] font-[400] gap-[4px]">
          <span>Manage exist assets on</span>
          <Link className="text-black underline decoration-solid" href='/lending/bend'>Bend</Link>
        </div>
      </div>
    </DappModal>
  );
};

export default BendLending;

interface Props {
}
