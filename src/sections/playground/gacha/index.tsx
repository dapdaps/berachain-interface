'use client';

import { useRef, useState } from "react";
import Title from "./components/title";
import NFTCard from "./components/nft-card";
import BearBox, { BearBoxHandle } from "./components/bear-box";
import ActionTabs from "./components/action-tabs";
import { Cat1, Cat2 } from "./components/cat";
import History from "./components/history";
import SuccessOpen from "./components/success-open";

export default function Gacha() {
  const bearBoxRef = useRef<BearBoxHandle>(null);
  const [showSuccessOpen, setShowSuccessOpen] = useState(false);

  const handlePlay = () => {
    bearBoxRef.current?.start();
  };

  const handleGachaComplete = () => {
    setTimeout(() => {
      setShowSuccessOpen(true);
    }, 1000);
  };

  const handleCloseSuccessOpen = () => {
    setShowSuccessOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#2F1D17] mt-[-68px] pt-[68px] pb-[80px]">
      <Title />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between gap-[40px]">
          <NFTCard
            title="Bullas"
            floorPrice="39.00"
            remaining={{ current: 9, total: 20 }}
            probabilities={[
              { percentage: "0.1", value: 1 },
              { percentage: "4", value: 20 },
              { percentage: "48", value: 50 },
            ]}
            imageUrl="/images/treasure-book/reward/nft-bullas.png"
          />
          
          <NFTCard
            title="Mibera"
            floorPrice="25.00"
            remaining={{ current: 15, total: 20 }}
            probabilities={[
              { percentage: "0.5", value: 2 },
              { percentage: "5", value: 25 },
              { percentage: "50", value: 60 },
            ]}
            imageUrl="/images/treasure-book/reward/nft-mibera.png"
          />
          
          <NFTCard
            title="Steady Teddy"
            floorPrice="18.50"
            remaining={{ current: 12, total: 20 }}
            probabilities={[
              { percentage: "1", value: 5 },
              { percentage: "8", value: 30 },
              { percentage: "45", value: 55 },
            ]}
            imageUrl="/images/treasure-book/reward/nft-steady-teddy.png"
          />
        </div>
      </div>

      <div className="pb-[80px] bg-[url('/images/gacha/floor.png')] bg-no-repeat bg-bottom bg-[length:100%_auto] relative">
            <div className="container mx-auto">
              <div className="flex justify-between gap-[40px] ">
                <BearBox ref={bearBoxRef} onComplete={handleGachaComplete} />
                <ActionTabs onPlay={handlePlay} />
              </div>
            </div>
            <Cat1 />
            <Cat2 />
      </div>

      <div className="container mx-auto">
          <History />
      </div>

     
      <SuccessOpen visible={showSuccessOpen} onClose={handleCloseSuccessOpen} />
    </div>
  );
}