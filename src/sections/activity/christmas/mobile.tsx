import Top from "@/sections/activity/christmas/sections/top";
import NFTProgress from "@/sections/activity/christmas/sections/progress";
import Summary from "@/sections/activity/christmas/sections/summary";
import GiftBox from "@/sections/activity/christmas/sections/gift-box";
import Quest from "@/sections/activity/christmas/sections/quest";
import { ChristmasContext } from "@/sections/activity/christmas/context";
import SwapModal from "@/sections/swap/SwapModal";
import { beraB } from "@/configs/tokens/bera-bArtio";
import { protocols, SnowToken } from "@/sections/activity/christmas/config";
import React, { useContext, useState } from "react";
import RulesModal from "./rules-modal";
import TotalPrizeModal from "./total-prize-modal";
import MobileHeader from '@/sections/home/mobile/header';
import RingButton from '@/layouts/main/ring';
import { useChristmas } from '@/hooks/use-christmas';

const ChristmasMobile = () => {
  const { isChristmas } = useChristmas();

  const { showSwapModal, setShowSwapModal } = useContext(ChristmasContext);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showTotalPrizeModal, setShowTotalPrizeModal] = useState(false);

  return (
    <div className="relative bg-[linear-gradient(180deg,_#000_0%,_#455972_35dvh)] h-full overflow-y-auto">
      <MobileHeader />
      {isChristmas && (
        <RingButton className="absolute top-[57px] right-[16px] scale-[0.667] z-[1]" />
      )}
      <Top
        onOpenRules={() => {
          setShowRulesModal(true);
        }}
      >
        <NFTProgress />
      </Top>
      <Summary
        onOpenRewards={() => {
          setShowTotalPrizeModal(true);
        }}
      />
      <GiftBox />
      <Quest />
      {showSwapModal && (
        <SwapModal
          show={showSwapModal}
          defaultInputCurrency={SnowToken}
          defaultOutputCurrency={beraB["bera"]}
          protocols={protocols}
          onClose={() => {
            setShowSwapModal?.(false);
          }}
        />
      )}
      <RulesModal
        open={showRulesModal}
        onClose={() => {
          setShowRulesModal(false);
        }}
        onOpenRewards={() => {
          setShowTotalPrizeModal(true);
        }}
      />
      <TotalPrizeModal
        open={showTotalPrizeModal}
        onClose={() => {
          setShowTotalPrizeModal(false);
        }}
        isMobile={true}
      />
    </div>
  );
};

export default ChristmasMobile;
