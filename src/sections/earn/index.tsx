import Tabs from "@/components/tabs";
import { useState } from "react";
import LiquidityList from "@/sections/marketplace/components/liquidity";

const EarnViews = () => {
  const [currentTab, setCurrentTab] = useState<string>("liquidity");

  return (
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
            children: <div>lending</div>,
          },
          {
            key: "staking",
            label: "Staking",
            children: <div>staking</div>,
          },
        ]}
      />
    </div>
  );
};

export default EarnViews;
