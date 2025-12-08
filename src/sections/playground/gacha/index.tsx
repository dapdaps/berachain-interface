"use client";

import { useRef, useState } from "react";
import Title from "./components/title";
import NFTCard from "./components/nft-card";
import BearBox, { BearBoxHandle } from "./components/bear-box";
import ActionTabs from "./components/action-tabs";
import { Cat1, Cat2 } from "./components/cat";
import History from "./components/history";
import SuccessOpen from "./components/success-open";
import useNftBalance from "./hooks/use-nft-balance";
import usePlayGame from "./hooks/use-play-game";
import useConfig from "./hooks/use-config";
import { NFTS } from "./config";

export default function Gacha() {
  const bearBoxRef = useRef<BearBoxHandle>(null);
  const [showSuccessOpen, setShowSuccessOpen] = useState(false);
  const { nftBalance, loading: nftBalanceLoading } = useNftBalance();
  const { config } = useConfig();
  const { playGame, loading, gameRequest } = usePlayGame(config);

  const handlePlay = (tier: number) => {
    console.log("tier", tier);
    playGame(tier);
    // bearBoxRef.current?.start();
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

      <div className="container mx-auto py-12 flex justify-center gap-[40px] w-[1450px]">
        {NFTS.map((nft) => (
          <NFTCard
            key={nft.address}
            title={nft.name}
            floorPrice="39.00"
            balance={nftBalance?.[nft.address]}
            probabilities={nft.probabilities}
            imageUrl={nft.icon}
            total={nft.total}
            className="w-[425px]"
          />
        ))}
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
