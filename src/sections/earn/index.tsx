import Tabs from "@/components/tabs";
import { useState } from "react";
import LiquidityList from "@/sections/marketplace/components/liquidity";
import EarnLending from "@/sections/earn/lending";

import StakingList from "@/sections/marketplace/components/lnvest";
import {
  useMarketplaceContext,
  MarketplaceContext
} from "@/sections/marketplace/context";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
const EarnViews = () => {
  const search = useSearchParams();
  let defaultTab = search.get("tab");
  defaultTab =
    defaultTab && ["liquidity", "lending", "staking"].includes(defaultTab)
      ? defaultTab
      : "";

  const [currentTab, setCurrentTab] = useState<string>(
    defaultTab || "liquidity"
  );
  const context = useMarketplaceContext({ chainId: 80094 });
  const Vaults = dynamic(
    () => import("@/sections/marketplace/components/dapps/vaults")
  );
  return (
    <MarketplaceContext.Provider value={context}>
      <div className="w-full lg:h-full md:h-dvh md:bg-[#5B5B5B] md:overflow-y-scroll md:overflow-x-hidden">

        <div className="w-[342px] h-[92px] mx-auto md:flex hidden items-center justify-center bg-[url('/images/mobile/earn.png')] bg-center bg-contain">
          <div className="text-black font-CherryBomb text-[24px]">
            Earn Yield
          </div>
        </div>
        {/* <img
          src="/images/mobile/earn.png"
          className="w-[342px] h-[92px] mx-auto md:block hidden"
          alt=""
        /> */}
        <div className="hidden lg:flex justify-center mb-[12px]">
          <div className="w-[113px]">
            <img src="/images/background/earn-header-left.png" alt="earn-header-left" />
          </div>
          <div className="mt-[10px] text-white font-CherryBomb text-[60px] leading-[90%]">Earn Yield</div>
          <div className="m-[27px_0_0_7px] w-[97px]">
            <img src="/images/background/earn-header-right.png" alt="earn-header-right" />
          </div>
        </div>

        <Tabs
          isCard
          page="earn"
          maxTabs={3}
          currentTab={currentTab}
          onChange={(key) => setCurrentTab(key as string)}
          tabs={[
            {
              key: "liquidity",
              label: <div>Liquidity</div>,
              children: <LiquidityList />
            },
            {
              key: "lending",
              label: <div>Lending</div>,
              children: <EarnLending />
            },
            {
              key: "staking",
              label: <div>Staking</div>,
              children: <StakingList source="earn" />
            }
          ]}
        />
      </div>
      <Vaults />
    </MarketplaceContext.Provider>
  );
};

export default EarnViews;
