'use client';

import { useState } from "react";
import Rules from "./rules";
import { playClickSound } from "../sound";
import { NftRewardItem } from "../hooks/use-nft-config";

export default function Title({ nftConfig }: { nftConfig: NftRewardItem[] }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <>
      <div>
        <div className="w-[350px] mx-auto relative">
          <img src="/images/gacha/gacha-title.png" alt="title" className="w-[350px]" />
          <img 
            src="/images/gacha/rule.png" 
            alt="rules" 
            className="absolute right-[-70px] top-[10px] w-[65px] cursor-pointer hover:scale-110 transition-transform" 
            onClick={() => {
              playClickSound();
              setShowRules(true);
            }}
          />
        </div>
      </div>
      
      <Rules visible={showRules} onClose={() => setShowRules(false)} nftConfig={nftConfig} />
    </>
  );
}