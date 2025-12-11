"use client";

import { useEffect, useMemo, useState } from "react";
import { GACHA_TABS } from "../config";
import ActionBtn from "./action-btn";
import useTokenBalance from "@/hooks/use-token-balance";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import BearAmountTabs from "./bear-amount-tabs";

const PROBABILITY_CARD_COLORS = [
  "#D9D9D9", 
  "#B2E946", 
  "#15C1FF", 
  "#ECA1FF", 
  "#FF6FA9", 
  "#FFB115",
];

interface ActionTabsProps {
  onPlay?: (tier: number) => void;
  loading?: boolean;
  config?: any;
  activeTabId?: any;
  setActiveTabId?: (tabId: any) => void;
}

export default function ActionTabs({ onPlay, loading, config, activeTabId, setActiveTabId }: ActionTabsProps) {
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
    <div className="w-[586px] pt-[40px]">
      {/* Tab Content */}
      <div className="bg-[url('/images/gacha/tab-content.png')] bg-no-repeat bg-center bg-[length:100%_100%] rounded-lg px-8 pb-8 relative text-black text-[16px]">
        <div className="bg-[url('/images/gacha/tab-title.png')] flex justify-center items-center bg-no-repeat bg-center bg-[length:100%_100%] w-[265px] h-[58px] mx-auto relative top-[-29px]">
          <span className="text-[26px] text-black font-CherryBomb font-[400]">{activeTab?.label}</span>
        </div>

        {/* Probabilities Section */}
        {activeTab?.probabilities && (
          <div className="mb-[20px] min-h-[215px] mt-[-5px]">
            <div className="font-[700] text-[20px] mb-3">Win Rate</div>
            <div className="grid grid-cols-3 gap-[10px]">
              {activeTab.probabilities.map((item, index) => {
                const color = PROBABILITY_CARD_COLORS[index % PROBABILITY_CARD_COLORS.length];
                return (
                  <div
                    key={index}
                    className="bg-[#41372F] rounded-lg font-[600] px-4 py-2 flex flex-col"
                    style={{
                      borderTop: `4px solid ${color}`,
                    }}
                  >
                    <span className="text-white text-[14px] font-[600]">{item.name}</span>
                    <span className="text-[20px] font-[700] mt-[10px]" style={{ color }}>
                      {item.probability}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="text-[20px] font-[700] text-black mb-3">Entry</div>
        <BearAmountTabs activeTabId={activeTabId} setActiveTabId={setActiveTabId ?? (() => {})} />

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
