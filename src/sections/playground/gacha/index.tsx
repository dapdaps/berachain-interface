"use client";

import { useEffect, useRef, useState } from "react";
import Title from "./components/title";
import NFTCard from "./components/nft-card";
import BearBox, { BearBoxHandle } from "./components/bear-box";
import ActionTabs from "./components/action-tabs";
import { Cat1, Cat2 } from "./components/cat";
import History from "./components/history";
import SuccessOpen from "./components/success-open";
import Marquee from "./components/marquee";
import useNftBalance from "./hooks/use-nft-balance";
import usePlayGame from "./hooks/use-play-game";
import useConfig from "./hooks/use-config";
import useTopNftRecords from "./hooks/use-top-nft-records";
import { GACHA_TABS, NFTS } from "./config";
import PageBack from "@/components/back";
import { stopSound, SOUND_PATHS } from "./sound";
import { useAudioStore } from "@/stores/use-audio";

export default function Gacha() {
  const hasPlayedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const bearBoxRef = useRef<BearBoxHandle>(null);
  const [showSuccessOpen, setShowSuccessOpen] = useState(false);
  const { nftBalance, loading: nftBalanceLoading, nftPrice } = useNftBalance();
  const { config } = useConfig();
  const { playGame, loading, gameRequest } = usePlayGame(config);
  const { data: topNftRecords, loading: topNftLoading } = useTopNftRecords();
  const [loadingPlay, setLoadingPlay] = useState(false);
  const [playCount, setPlayCount] = useState(0);
  const [activeTabId, setActiveTabId] = useState(GACHA_TABS[0].id);
  const open = useAudioStore((state: any) => state.open);

  const handlePlay = async (tier: number) => {
    if (loadingPlay) {
      return;
    }

    console.log("tier", tier);
    setLoadingPlay(true);
    try {
      await playGame(tier);
      bearBoxRef.current?.start();
    } catch (error) {
      console.error("Play game failed: %o", error);
    } finally {
      setLoadingPlay(false);
    }
  };

  const handleGachaComplete = () => {
    setTimeout(() => {
      setShowSuccessOpen(true);
    }, 1000);

    setTimeout(() => {
      setPlayCount(playCount + 1);
    }, 5000);
  };

  const handleCloseSuccessOpen = () => {
    setShowSuccessOpen(false);
  };

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(SOUND_PATHS.background);
      audioRef.current.loop = false; 
    }

    const playBgMusic = async () => {
      if (hasPlayedRef.current || !audioRef.current || !open) return;
      
      try {
        await audioRef.current.play();
        hasPlayedRef.current = true;
      } catch (error) {
        console.log("Auto-play blocked, waiting for user interaction");
      }
    };

    const unlockAudio = async () => {
      if (hasPlayedRef.current || !audioRef.current || !open) return;
      
      try {
        await audioRef.current.play();
        hasPlayedRef.current = true;
      } catch (error) {
        console.error("Failed to play background music:", error);
      }
      
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };

    playBgMusic();
    if (!hasPlayedRef.current) {
      document.addEventListener("click", unlockAudio, { once: true });
      document.addEventListener("touchstart", unlockAudio, { once: true });
      document.addEventListener("keydown", unlockAudio, { once: true });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      stopSound(SOUND_PATHS.background);
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
    };
  }, [open]);

  return (
    <div className="min-h-screen bg-[#2F1D17] mt-[-68px] pt-[68px] pb-[80px]">
      <PageBack className="ml-[30px] absolute top-[80px] left-[15px] z-10 text-white"  isBlack={false} />
      <Title />

      <div className="container min-w-[1200px] mx-auto py-12 flex justify-center gap-[40px] w-[1450px]">
        {NFTS.map((nft) => (
          <NFTCard
            key={nft.address}
            title={nft.name}
            address={nft.address}
            floorPrice={nftPrice[nft.address.toLowerCase()] || "-"}
            balance={nftBalance?.[nft.address]}
            probabilities={nft.probabilities}
            imageUrl={nft.icon}
            total={nft.total}
            className="w-[425px]"
          />
        ))}
      </div>

      <div className="pb-[120px] bg-[url('/images/gacha/floor.png')] bg-no-repeat bg-bottom bg-[length:100%_auto] relative">
        <div className="container min-w-[1200px] mx-auto">
          <div className="flex justify-between gap-[40px] pr-[80px]">
            <BearBox ref={bearBoxRef} onComplete={handleGachaComplete} />
            <ActionTabs onPlay={handlePlay} loading={loadingPlay} config={config} activeTabId={activeTabId} setActiveTabId={setActiveTabId} />
          </div>
        </div>
        <Cat1 />
        <Cat2 />
      </div>

      {topNftRecords.length > 0 && (
        <div className="w-full py-6 px-4">
          <Marquee items={topNftRecords} speed={50} gap={16} className="w-full" />
        </div>
      )}

      <div className="container min-w-[1200px] mx-auto">
        <History refresh={playCount}/>
      </div>

      <SuccessOpen visible={showSuccessOpen} onClose={handleCloseSuccessOpen} data={gameRequest} activeTabId={activeTabId} setActiveTabId={setActiveTabId} />
    </div>
  );
}
