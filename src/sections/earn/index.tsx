import Tabs from "@/components/tabs";
import { useState } from "react";
import LiquidityList from "@/sections/marketplace/components/liquidity";
import EarnLending from '@/sections/earn/lending';

import StakingList from "@/sections/marketplace/components/lnvest";
import { useMarketplaceContext, MarketplaceContext } from '@/sections/marketplace/context';
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation';
const EarnViews = () => {
  const search = useSearchParams();
  let defaultTab = search.get('tab');
  defaultTab = defaultTab && ['liquidity', 'lending', 'staking'].includes(defaultTab) ? defaultTab : '';

  const [currentTab, setCurrentTab] = useState<string>(defaultTab || "liquidity");
  const context = useMarketplaceContext({ chainId: 80084 });
  const Vaults = dynamic(
    () => import('@/sections/marketplace/components/dapps/vaults')
  );
  return (
    <MarketplaceContext.Provider value={context}>
      <div className="w-full min-h-screen md:bg-[#5B5B5B]">
        <img
          src="/images/mobile/earn.png"
          className="w-[342px] h-[92px] mx-auto md:block hidden"
          alt=""
        />
        <img
            src="/images/background/earn-header.png"
            alt="earn"
            className="w-[345px] h-[98px] mb-[12px] hidden lg:block m-auto"
          />
         
        <Tabs
          isCard
          page="earn"
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
