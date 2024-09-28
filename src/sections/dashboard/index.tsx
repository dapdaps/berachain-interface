'use client';

import PageTitle from '@/components/title';
import PageBack from '@/components/back';
import Tabs, { TabKey } from '@/components/tabs';
import DashboardTab from '@/sections/dashboard/components/tab';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import BearBackground from '@/components/bear-background';

const DashboardWallet = dynamic(() => import('@/sections/dashboard/components/wallet'));
const DashboardPortfolio = dynamic(() => import('@/sections/dashboard/components/portfolio'));
const DashboardRecords = dynamic(() => import('@/sections/dashboard/components/records'));

const DashboardView = () => {

  const [currentTab, setCurrentTab] = useState<TabKey>(tabs[0].key);

  return (
    <BearBackground type='dashboard'>
      <PageBack className="absolute left-[36px] top-[31px]" />
      <PageTitle className="pt-[30px]">Dashboard</PageTitle>
      <div className="relative w-[882px] mx-auto mt-[30px] z-50">
        <Tabs
          currentTab={currentTab}
          tabs={tabs}
          onChange={(tabKey) => {
            setCurrentTab(tabKey);
          }}
        />
      </div>
    </BearBackground>
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
