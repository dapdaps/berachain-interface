import React, { useMemo, useState } from 'react';
import ActionPanel from '@/sections/Lending/components/action-panel';
import useAddAction from '@/hooks/use-add-action';
import { TabPanelProps, Tabs } from '@/sections/Lending/Dolomite/Panel/types';
import { motion } from "framer-motion";
import Big from 'big.js';
import Drawer from '@/components/drawer';
import MarketsMobile from '@/sections/Lending/components/markets/mobile';

const TabPanelMobile: React.FC<TabPanelProps> = ({
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
  const [visible, setVisible] = useState(false);
  const [token, setToken] = useState<any>();
  const [actionType, setActionType] = useState<any>();

  const currentIndex = useMemo(() => {
    const idx = Tabs.findIndex((it: any) => it.value === rateKey);
    if (idx < 0) return 0;
    return idx;
  }, [Tabs, rateKey]);

  const handleClose = () => {
    setVisible(false);
    setToken(void 0);
    setActionType(void 0);
  };

  const handleDeposit = (token: any) => {
    setToken(token);
    setActionType('Deposit');
    setVisible(true);
  };

  const handleWithdraw = (token: any) => {
    setToken(token);
    setActionType('Withdraw');
    setVisible(true);
  };

  return (
    <div className="overflow-x-hidden overflow-y-auto mx-[-10px] max-h-[calc(100vh_-_200px)] pb-[80px]">
      <div className="flex items-stretch gap-[10px]">
        <div className="flex items-start bg-[#FFDC50] rounded-[10px] p-[13px_30px_18px_16px] gap-[50px] flex-1">
          <div className=" whitespace-nowrap">
            <div className="font-Montserrat text-[14px] font-medium leading-[17px] text-left text-[#3D405A] mb-[8px]">{totalBalanceLabel}</div>
            <p className="font-Montserrat text-[22px] font-semibold leading-[20px] text-left text-black">{totalBalance}</p>
          </div>
          <div className=" whitespace-nowrap">
            <div className="font-Montserrat text-[14px] font-medium leading-[17px] text-left text-[#3D405A] mb-[8px]">{totalRateLabel} {rateKey}</div>
            <p className="font-Montserrat text-[22px] font-semibold leading-[20px] text-left text-black">{totalRate}</p>
          </div>
        </div>
        <div className="ml-auto">
          <div className="w-[48px] flex flex-col p-[4px] border border-[#373A53] rounded-[12px] bg-white">
            <div className="relative w-full">
              {
                Tabs.map((tab: any, index: number) => (
                  <div
                    key={index}
                    className="relative z-[1] w-full h-[32px] flex justify-center items-center rounded-[10px] text-[14px] text-black font-[400]"
                    onClick={() => {
                      setRateKey(tab.value);
                    }}
                  >
                    {tab.label}
                  </div>
                ))
              }
              <motion.div
                className="w-full h-[32px] absolute z-[0] left-[0] top-[0] border border-black bg-[#FFDC50] rounded-[10px]"
                animate={{
                  y: `${100 * currentIndex}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <MarketsMobile
        loading={loading}
        columns={[
          {
            title: 'pool',
            dataIndex: 'pool',
            type: 'asset',
          },
          {
            title: `Supply ${rateKey}`,
            dataIndex: 'pool',
            render: (text: any, record: any) => {
              return record[rateKey];
            }
          },
          {
            title: 'In Wallet',
            dataIndex: 'walletBalanceShown',
            style: (record: any) => {
              return {
                opacity: Big(record.walletBalance || 0).gt(0) ? 1 : 0.3,
              };
            },
          },
          {
            title: 'Supplied',
            dataIndex: 'balanceShown',
            style: (record: any) => {
              return {
                opacity: Big(record.balance || 0).gt(0) ? 1 : 0.3,
              };
            },
          },
        ]}
        markets={tokens}
        onSuccess={onSuccess}
        onDeposit={handleDeposit}
        onWithdraw={handleWithdraw}
        actionDisabled={(record: any) => {
          return {
            deposit: false,
            withdraw: !record.balance || Big(record.balance).lte(0),
          };
        }}
      />
      <Drawer
        visible={visible}
        onClose={handleClose}
        size="65vh"
      >
        <div className="py-[23px]">
          <div className="text-[18px] font-[700] text-black px-[24px]">
            {actionType} {token?.symbol}
          </div>
          <ActionPanel
            isMobile
            title={actionType}
            actionText={actionType}
            placeholder="0.00"
            token={token}
            CHAIN_ID={CHAIN_ID}
            onSuccess={onSuccess}
            addAction={addAction}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default TabPanelMobile;
