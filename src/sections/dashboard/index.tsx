"use client";

import PageTitle from "@/components/title";
import PageBack from "@/components/back";
import Tabs, { TabKey } from "@/components/tabs";
import DashboardTab from "@/sections/dashboard/components/tab";
import dynamic from "next/dynamic";
import { useState } from "react";
import BearBackground from "@/components/bear-background";
import chains from "@/configs/chains";
import { useWallet } from "@/sections/dashboard/hooks/use-wallet";
import { usePortfolio } from "@/sections/dashboard/hooks/use-portfolio";
import { useTvl } from "@/sections/dashboard/hooks/use-tvl";
import { useRecords } from "@/sections/dashboard/hooks/use-records";

const DashboardWallet = dynamic(
  () => import("@/sections/dashboard/components/wallet")
);
const DashboardPortfolio = dynamic(
  () => import("@/sections/dashboard/components/portfolio")
);
const DashboardRecords = dynamic(
  () => import("@/sections/dashboard/components/records")
);

const currentChain = chains[80094];
const networkList = Object.values(chains);

const DashboardView = () => {
  const [currentTab, setCurrentTab] = useState<TabKey>(2);

  const {
    loading: tokensLoading,
    tokens,
    totalBalance
  } = useWallet({ currentChain, networkList });
  const {
    loading: dappsLoading,
    dapps,
    totalBalance: totalBalanceByDapps
  } = usePortfolio({ currentChain, networkList });
  const { tvls, loading: tvlsLoading } = useTvl({ currentChain, networkList });
  const {
    hasMore,
    records,
    loading: recordsLoading,
    pageIndex,
    pageTotal,
    handleNext,
    handlePrev
  } = useRecords({ currentChain, networkList });

  const tabs = [
    {
      key: 1,
      sort: 2,
      label: <DashboardTab icon="icon-in-wallet.svg">Wallet</DashboardTab>,
      children: (
        <DashboardWallet
          tokens={tokens}
          loading={tokensLoading}
          totalBalance={totalBalance}
        />
      )
    },
    {
      key: 2,
      sort: 1,
      label: <DashboardTab icon="icon-portfolio.svg">DeFi</DashboardTab>,
      children: (
        <DashboardPortfolio
          loading={dappsLoading}
          dapps={dapps}
          totalBalance={totalBalanceByDapps}
          tvls={tvls}
          tvlsLoading={tvlsLoading}
        />
      )
    },
    {
      key: 3,
      sort: 3,
      label: <DashboardTab icon="icon-records.svg">Transactions</DashboardTab>,
      children: (
        <DashboardRecords
          loading={recordsLoading}
          records={records}
          hasMore={hasMore}
          pageIndex={pageIndex}
          pageTotal={pageTotal}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )
    }
  ];

  return (
    <BearBackground type="dashboard">
      <PageBack className="absolute left-[36px] md:left-[15px] top-[31px] md:top-[14px]" />
      <PageTitle className="pt-[30px] md:pt-[16px] md:text-left md:pl-[40%]">
        Portfolio
      </PageTitle>
      <div className="w-[882px] mx-auto mt-[30px] md:mt-[25px] md:w-full md:h-[calc(100%-65px)]">
        <Tabs
          currentTab={currentTab}
          tabs={tabs.sort((a, b) => a.sort - b.sort)}
          onChange={(tabKey) => {
            setCurrentTab(tabKey);
          }}
          bodyInnerClassName="lg:h-[calc(100vh-300px)] md:h-[calc(100%-132px)]"
        />
      </div>
    </BearBackground>
  );
};

export default DashboardView;
