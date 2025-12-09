"use client";

import { useMemo, useState } from "react";
import { GACHA_TABS } from "../config";
import Image from "next/image";
import ActionBtn from "./action-btn";
import useTokenBalance from "@/hooks/use-token-balance";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";

interface ActionTabsProps {
  onPlay?: (tier: number) => void;
  loading?: boolean;
  config?: any;
}

export default function ActionTabs({ onPlay, loading, config }: ActionTabsProps) {
  const [activeTabId, setActiveTabId] = useState(GACHA_TABS[0].id);
  const { tokenBalance } = useTokenBalance('native', 18, DEFAULT_CHAIN_ID);

  const activeTab = GACHA_TABS.find((tab) => tab.id === activeTabId);

  const errorMessage = useMemo(() => {
    if (!config?.[activeTab?.tier || 0]?.isActive) {
      return "Rewards Empty – Coming Soon";
    }

    const tierConfig = config?.[activeTab?.tier || 0];
    const valueInWei = new Big(tierConfig.entryFee.toString() || '0').div(10 ** 18);
    
    if (valueInWei.gt(new Big(tokenBalance || '0'))) {
      return 'Insufficient Balance';
    }

    return '';
  }, [config, activeTab, tokenBalance]);

  const disabled = useMemo(() => {
    if (!config?.[activeTab?.tier || 0]?.isActive) {
      return true;
    }

    const tierConfig = config?.[activeTab?.tier || 0];
    const valueInWei = new Big(tierConfig.entryFee.toString() || '0').div(10 ** 18);
    
    if (valueInWei.gt(new Big(tokenBalance || '0'))) {
      return true;
    }

    return false;
  }, [config, activeTab, tokenBalance]);

  return (
    <div className="w-[586px]">
      {/* Tab Headers */}
      <div className="flex gap-[5px] relative top-[20px]">
        {GACHA_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              text-black flex-1 font-CherryBomb text-[20px] whitespace-nowrap transition-all px-[20px] h-[68px] 
              ${
                activeTabId === tab.id
                  ? "bg-[url('/images/gacha/tab-active.png')] bg-no-repeat bg-center bg-[length:100%_100%] pb-[15px] relative top-[-10px]"
                  : "bg-[url('/images/gacha/tab-bg.png')] bg-no-repeat bg-center bg-[length:100%_100%] pb-[20px]"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-[url('/images/gacha/tab-content.png')] bg-no-repeat bg-center bg-[length:100%_100%] rounded-lg p-8 relative text-black text-[16px]">
        {/* Play By Section */}
        {activeTab?.playByCost && (
          <div className="mb-2 flex items-center justify-center relative">
            <div className="font-[600] absolute top-0 left-0">Play by</div>
            <div className="flex items-center gap-3 5C3D2E] rounded-lg px-4 py-3 w-fit">
              <Image
                src="/assets/tokens/bera.svg"
                alt="BERA"
                width={56}
                height={56}
                className="rounded-full border-2 border-white"
              />
              <span className="font-CherryBomb font-bold text-[30px]">
                {activeTab.playByCost}
              </span>
            </div>
          </div>
        )}

        {/* Probabilities Section */}
        {activeTab?.probabilities && (
          <div className="mb-8">
            <div className="font-[600] mb-3">Probabilities</div>
            <div className="flex flex-wrap gap-[10px]">
              {activeTab.probabilities.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFFFFF33] rounded-lg font-[600] px-4 gap-[20px] py-3 flex items-center justify-between"
                >
                  <span className="">{item.name}</span>
                  <span className="">{item.probability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play Button */}
        <ActionBtn
          onPlay={onPlay}
          loading={loading}
          disabled={disabled}
          errorMessage={errorMessage}
          tier={activeTab?.tier || 0}
        />
      </div>
    </div>
  );
}
