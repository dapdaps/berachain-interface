import { useState } from "react";
import { GACHA_TABS } from "../config";
import { playClickSound } from "../sound";
import LightingButton, { LightingButtonType } from "@/components/button/lighting-button";
import Image from "next/image";

export default function BearAmountTabs({ activeTabId, setActiveTabId }: { activeTabId: any, setActiveTabId: (tabId: any) => void }) {
    return (<div className="flex bg-[#00000080] rounded-[12px] border border-[#FFCA80] mb-[27px] p-[3px]">
        {GACHA_TABS.map((tab) => (
            <button
                key={tab.id}
                onClick={() => {
                    playClickSound();
                    setActiveTabId(tab.id);
                }}
                className={`
         text-white font-[700] flex-1  whitespace-nowrap transition-all h-[52px] 
       `}
            >
                {
                    activeTabId === tab.id
                        ? <LightingButton type={LightingButtonType.Yellow} outerClassName="!w-full !h-full !border-[1px] !border-[#AF7026]" className="!w-full !h-full gap-[10px] !text-[20px] !font-Montserrat !border-none">
                            <Image
                                src="/assets/tokens/bera.svg"
                                alt="BERA"
                                width={22}
                                height={22}
                                className="rounded-full border-2 border-white"
                            /> {tab.value}
                        </LightingButton>
                        : <div className="flex items-center justify-center gap-[10px] text-[20px] font-Montserrat">
                            <Image
                                src="/assets/tokens/bera.svg"
                                alt="BERA"
                                width={22}
                                height={22}
                                className="rounded-full border-2 border-white"
                            /> {tab.value}
                        </div>
                }

            </button>
        ))}
    </div>
    );
}

