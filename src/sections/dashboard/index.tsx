'use client';

import PageTitle from '@/components/title';
import PageBack from '@/components/back';
import Tabs, { TabKey } from '@/components/tabs';
import DashboardTab from '@/sections/dashboard/components/tab';
import dynamic from 'next/dynamic';
import { useState } from 'react';

const DashboardWallet = dynamic(() => import('@/sections/dashboard/components/wallet'));
const DashboardPortfolio = dynamic(() => import('@/sections/dashboard/components/portfolio'));
const DashboardRecords = dynamic(() => import('@/sections/dashboard/components/records'));

const DashboardView = () => {

  const [currentTab, setCurrentTab] = useState<TabKey>(tabs[0].key);

  return (
    <div className="relative">
      <PageBack className="absolute left-[36px] top-[31px]" />
      <PageTitle className="pt-[30px]">Dashboard</PageTitle>
      <div className="w-[882px] mx-auto">
        <Tabs
          currentTab={currentTab}
          tabs={tabs}
          onChange={(tabKey) => {
            setCurrentTab(tabKey);
          }}
        />
      </div>
    </div>
  );
};

export default DashboardView;

const tabs = [
  {
    key: 1,
    label: (
      <DashboardTab icon="icon-in-wallet.svg">
        In wallet
      </DashboardTab>
    ),
    children: <DashboardWallet />
  },
  {
    key: 2,
    label: (
      <DashboardTab icon="icon-portfolio.svg">
        DeFi Portfolio
      </DashboardTab>
    ),
    children: <DashboardPortfolio />
  },
  {
    key: 3,
    label: (
      <DashboardTab icon="icon-records.svg">
        Execution Records
      </DashboardTab>
    ),
    children: <DashboardRecords />
  },
];
