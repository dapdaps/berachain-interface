import React from "react";
import Popover, { PopoverPlacement } from '@/components/popover';
import ActionPanel from '@/sections/Lending/components/action-panel';
import Button from '@/components/button';
import SwitchTabs from '@/components/switch-tabs';
import Skeleton from 'react-loading-skeleton';
import useAddAction from '@/hooks/use-add-action';
import { TabPanelProps, Tabs } from '@/sections/Lending/Dolomite/Panel/types';

const TabPanelLaptop: React.FC<TabPanelProps> = ({
  totalBalance,
  totalRate,
  rateName,
  tokens,
  onSuccess,
  showRateSwitch = true,
  rateKey,
  setRateKey,
  totalRateLabel,
  totalBalanceLabel,
  loading,
  CHAIN_ID,
}) => {
  const { addAction } = useAddAction("lending");

  return (
    <div className="h-[490px] max-h-[calc(100vh_-_300px)] overflow-x-hidden overflow-y-auto">
      <div className="flex mb-10 items-center">
        <div className="w-[150px]">
          <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">{totalBalanceLabel}</div>
          <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">{totalBalance}</p>
        </div>
        {/*<div className="w-[150px] ml-[142px]">
         <div className="font-Montserrat text-sm font-medium leading-[17px] text-left text-[#3D405A] mb-3">{totalRateLabel} {rateKey}</div>
         <p className="font-Montserrat text-[26px] font-semibold leading-[23.4px] text-left text-black">{totalRate}</p>
         </div>*/}
        {showRateSwitch && (
          <div className="ml-auto">
            <SwitchTabs
              tabs={Tabs}
              current={rateKey}
              onChange={(tab) => {
                setRateKey(tab);
              }}
              style={{
                width: 150,
                height: 40,
                padding: 4,
              }}
              tabStyle={{
                fontWeight: 400,
                fontSize: 14,
              }}
            />
          </div>
        )}
      </div>

      <div className="rounded-lg p-4">
        <div className="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] gap-4 font-bold mb-2 ">
          <div className="font-[500] text-[#3D405A]">Token</div>
          <div className="font-[500] text-[#3D405A]">{rateName}</div>
          <div className="font-[500] text-[#3D405A]">Balance</div>
          <div className="font-[500] text-[#3D405A]">In Wallet</div>
          <div className="font-[500] text-[#3D405A]"></div>
        </div>
        {
          loading ? [0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] gap-4 items-center py-[10px]"
            >
              <Skeleton width={248} height={39} />
              <Skeleton width={165} height={39} />
              <Skeleton width={165} height={39} />
              <Skeleton width={165} height={39} />
              <Skeleton width={82} height={39} />
            </div>
          )) : tokens.map((token) => (
            <div
              key={token.symbol}
              className="grid grid-cols-[3fr_2fr_2fr_2fr_1fr] gap-4 items-center py-[10px]"
            >
              <div className="flex items-center space-x-[12px]">
                <img src={token.icon} alt={token.symbol} className="w-[30px] h-[30px]" />
                <div>
                  <div className="font-[600] text-[16px]">{token.symbol}</div>
                  <div className="text-[10px] text-black">{token.name}</div>
                </div>
              </div>
              <div className="font-[600] text-[16px]">{token[rateKey]}</div>
              <div className="font-[600] text-[16px]">{token.balanceShown}</div>
              <div className="font-[600] text-[16px]">{token.walletBalanceShown}</div>
              <div className="flex space-x-[10px]">
                <Popover
                  placement={PopoverPlacement.BottomRight}
                  content={(
                    <ActionPanel
                      title="Deposit"
                      actionText="Deposit"
                      placeholder="0.00"
                      token={token}
                      CHAIN_ID={CHAIN_ID}
                      onSuccess={onSuccess}
                      addAction={addAction}
                    />
                  )}
                >
                  <Button style={{ width: 32 }}>
                    +
                  </Button>
                </Popover>
                <Popover
                  placement={PopoverPlacement.BottomRight}
                  content={(
                    <ActionPanel
                      title="Withdraw"
                      actionText="Withdraw"
                      placeholder="0.00"
                      token={token}
                      isSkipApproved={true}
                      CHAIN_ID={CHAIN_ID}
                      onSuccess={onSuccess}
                      addAction={addAction}
                    />
                  )}
                >
                  <Button style={{ width: 32 }}>
                    -
                  </Button>
                </Popover>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TabPanelLaptop;
