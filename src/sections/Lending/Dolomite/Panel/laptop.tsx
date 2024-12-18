import React from "react";
import ActionPanel from '@/sections/Lending/components/action-panel';
import SwitchTabs from '@/components/switch-tabs';
import useAddAction from '@/hooks/use-add-action';
import { TabPanelProps, Tabs } from '@/sections/Lending/Dolomite/Panel/types';
import MarketsLaptop from '@/sections/Lending/components/markets/laptop';

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
      <MarketsLaptop
        loading={loading}
        laptopGridCols="grid-cols-[3fr_2fr_2fr_2fr_1fr]"
        columns={[
          {
            title: 'Token',
            dataIndex: 'token',
            type: 'asset',
            skeletonWidth: 248,
          },
          {
            title: rateName,
            dataIndex: 'rate',
            skeletonWidth: 165,
            render: (text: any, token: any) => {
              return token[rateKey];
            }
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
        markets={tokens}
        depositPanel={(token: any) => (
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
        withdrawPanel={(token: any) => (
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
      />
    </div>
  );
};

export default TabPanelLaptop;
