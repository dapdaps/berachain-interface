import React, { useMemo } from 'react';
import Popover, { PopoverPlacement } from '@/components/popover';
import ActionPanel from '@/sections/Lending/components/action-panel';
import Button from '@/components/button';
import SwitchTabs from '@/components/switch-tabs';
import Skeleton from 'react-loading-skeleton';
import useAddAction from '@/hooks/use-add-action';
import { TabPanelProps, Tabs } from '@/sections/Lending/Dolomite/Panel/types';
import { motion } from "framer-motion";

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

  const currentIndex = useMemo(() => {
    const idx = Tabs.findIndex((it: any) => it.value === rateKey);
    if (idx < 0) return 0;
    return idx;
  }, [Tabs, rateKey]);

  return (
    <div className="overflow-x-hidden overflow-y-auto mx-[-10px]">
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
      <div className="mt-[20px] flex flex-col gap-[12px]">
        <div className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[16px_14px_14px_14px] flex flex-col gap-[19px] items-stretch">
          <div className="flex justify-between items-center gap-[10px]">
            <div className="flex items-center gap-[11px]">
              <img src="/images/icon-coin.svg" alt="" className="w-[40px] h-[40px] rounded-full" />
              <div className="text-[16px] text-black font-[600]">
                <div>BERA</div>
                <div className="text-[10px] font-[400] mt-[5px]">
                  Berachain token
                </div>
              </div>
            </div>
            <div className="flex justify-end items-center gap-[10px]">
              <button
                type="button"
                className="rounded-[10px] border border-[#373A53] h-[32px] leading-[30px] px-[15px]"
              >
                Get
              </button>
              <button
                type="button"
                className="rounded-[10px] border border-[#373A53] bg-[#FFDC50] h-[32px] w-[32px] flex justify-center items-center"
                disabled
                style={{ opacity: 0.3 }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.02111 8.09214L12.7387 8.09217C13.0934 8.09211 13.381 7.86507 13.3809 7.58523L13.3809 6.55662C13.3809 6.27673 13.0932 6.05045 12.7383 6.05004L8.02104 6.05018L8.02095 1.33277C8.02112 0.977856 7.79426 0.690062 7.51418 0.690237L6.48551 0.690289C6.20591 0.69011 5.97887 0.977726 5.97911 1.33269L5.9792 6.05023L1.26149 6.05032C0.906932 6.05026 0.619081 6.27671 0.619142 6.55666L0.619089 7.58533C0.619091 7.86523 0.906768 8.09221 1.26144 8.09227L5.97921 8.09224L5.97918 12.8093C5.97913 13.1647 6.20581 13.4519 6.48571 13.452L7.51438 13.4519C7.79422 13.4518 8.02108 13.1644 8.02131 12.8097L8.02111 8.09214Z"
                    fill="black"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="rounded-[10px] border border-[#373A53] bg-[#FFDC50] h-[32px] w-[32px] flex justify-center items-center"
                disabled={false}
                style={{ opacity: 1 }}
              >
                <svg width="13" height="2" viewBox="0 0 13 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="13" height="2" rx="1" fill="black" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center gap-[10px] text-[16px] text-black font-[600]">
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">
                Supply APY
              </div>
              <div className="">
                78.15%
              </div>
            </div>
            <div className="">
              <div className="text-[#3D405A] text-[14px] font-[500]">
                In Wallet
              </div>
              <div className="opacity-30">
                0.00
              </div>
            </div>
            <div className="text-right">
              <div className="text-[#3D405A] text-[14px] font-[500]">
                Supplied
              </div>
              <div className="">
                0.23
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabPanelMobile;
