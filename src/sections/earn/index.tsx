import Tabs from "@/components/tabs";
import { useState } from "react";
import LiquidityList from "@/sections/marketplace/components/liquidity";
import EarnLending from '@/sections/earn/lending';

import StakingList from "@/sections/marketplace/components/lnvest";
import { useMarketplaceContext, MarketplaceContext } from '@/sections/marketplace/context';
import dynamic from "next/dynamic";
const EarnViews = () => {
  const [currentTab, setCurrentTab] = useState<string>("liquidity");
  const context = useMarketplaceContext({ chainId: 80084 });
  const Vaults = dynamic(
    () => import('@/sections/marketplace/components/dapps/vaults')
  );
  return (
    <MarketplaceContext.Provider value={context}>
      <div className="w-full min-h-screen bg-[#5B5B5B]">
        <img
          src="/images/mobile/earn.png"
          className="w-[342px] h-[92px] mx-auto"
          alt=""
        />
        <Tabs
          isCard
          maxTabs={3}
          currentTab={currentTab}
          onChange={(key) => setCurrentTab(key as string)}
          tabs={[
            {
              key: "liquidity",
              label: "Liquidity",
              children: <LiquidityList />,
            },
            {
              key: "lending",
              label: "Lending",
              children: <EarnLending />,
            },
            {
              key: "staking",
              label: "Staking",
              children: <StakingList />,
            },
          ]}
        />
      </div>
      <Vaults />
    </MarketplaceContext.Provider>
  );
};

export default EarnViews;
