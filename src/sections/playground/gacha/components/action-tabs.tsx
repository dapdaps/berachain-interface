"use client";

import { useState } from "react";
import { GACHA_TABS } from "../config";
import Image from "next/image";
import LightButton from "@/components/check-in/button";

interface ActionTabsProps {
  onPlay?: (tier: number) => void;
}

export default function ActionTabs({ onPlay }: ActionTabsProps) {
  const [activeTabId, setActiveTabId] = useState(GACHA_TABS[0].id);

  const activeTab = GACHA_TABS.find((tab) => tab.id === activeTabId);

  return (
    <div className="w-[586px]">
      {/* Tab Headers */}
      <div className="flex gap-[5px] relative top-[20px]">
        {GACHA_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTabId(tab.id)}
            className={`
              text-black flex-1 font-CherryBomb text-[20px] transition-all px-[20px] h-[68px] 
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
                className="rounded-full"
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
                  className="bg-[#FFFFFF33] rounded-lg px-4 gap-[20px] py-3 flex items-center justify-between"
                >
                  <span className="">{item.name}</span>
                  <span className="">{item.probability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Play Button */}
        <LightButton
          className="w-full h-[60px]"
          onClick={() => {
            onPlay?.(activeTab?.tier || 0);
          }}
        >
          PLAY
        </LightButton>
      </div>
    </div>
  );
}
