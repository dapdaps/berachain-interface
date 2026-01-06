"use client";

import { useEffect, useMemo, useState } from "react";
import { GACHA_TABS } from "../config";
import ActionBtn from "./action-btn";
import useTokenBalance from "@/hooks/use-token-balance";
import { DEFAULT_CHAIN_ID } from "@/configs";
import Big from "big.js";
import BearAmountTabs from "./bear-amount-tabs";
import { numberFormatter } from "@/utils/number-formatter";

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
  tokenNameMap?: Record<string, string>;
  tokenMap?: Record<string, string>;
}

export default function ActionTabs({ onPlay, loading, config, activeTabId, setActiveTabId, tokenMap, tokenNameMap }: ActionTabsProps) {
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

  const probabilities = useMemo(() => {
    const tierConfig = config?.[activeTab?.tier || 0];

    if (tierConfig && tokenNameMap && Object.keys(tokenNameMap).length > 0) {
      const newProbabilities: any[] = tierConfig.rewards.map((reward: any, index: number) => {
        return {
          ...reward,
          tokenAddress: reward.tokenAddress.toLowerCase(),
          url: tokenMap?.[reward.tokenAddress.toLowerCase()],
          name: Big(reward.amount).div(10 ** 18).toString() + ' ' + (tokenNameMap?.[reward.tokenAddress.toLowerCase()] || ''),
          probability: numberFormatter( 
            index === 0 
            ? Big(reward.probability).div(10000) 
            : Big(reward.probability).minus(Big(tierConfig.rewards[index - 1].probability)).div(10000), 2, true
          ) + '%',
        };
      });
      return newProbabilities;
    } 

    // return activeTab?.probabilities?.map((item) => {
    //   return {
    //     ...item,
    //     probability: item.probability + '%',
    //   };
    // });
  }, [activeTab, config, tokenNameMap]);

  return (
    <div className="w-[586px] pt-[40px]">
      {/* Tab Content */}
      <div className="bg-[url('/images/gacha/tab-content.png')] bg-no-repeat bg-center bg-[length:100%_100%] rounded-lg px-8 pb-8 relative text-black text-[16px]">
        <div className="bg-[url('/images/gacha/tab-title.png')] flex justify-center items-center bg-no-repeat bg-center bg-[length:100%_100%] w-[265px] h-[58px] mx-auto relative top-[-29px]">
          <span className="text-[26px] text-black font-CherryBomb font-[400]">{activeTab?.label}</span>
        </div>

        {/* Probabilities Section */}
        {(Array.isArray(probabilities) && probabilities.length > 0) && (
          <div className="mb-[20px] min-h-[215px] mt-[-5px]">
            <div className="font-[700] text-[20px] mb-3">Win Rate</div>
            <div className="grid grid-cols-3 gap-[10px]">
              {probabilities.map((item, index) => {
                const color = PROBABILITY_CARD_COLORS[index % PROBABILITY_CARD_COLORS.length];
                return (
                  <div
                    key={index}
                    className="bg-[#41372F] rounded-lg font-[600] px-4 py-2 flex flex-col"
                    style={{
                      borderTop: `4px solid ${color}`,
                    }}
                  >
                    {
                      item.rewardType !== 1 
                      ? <div className="text-white text-[14px] font-[600] whitespace-nowrap text-ellipsis overflow-hidden">{item.name || ''}</div>
                      : <div className="flex items-center gap-[5px] text-white text-[14px] font-[600]">NFT-<img src={item.url} className="w-[16px] h-[16px] object-cover rounded-[4px]"/></div>
                    }
                    
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
