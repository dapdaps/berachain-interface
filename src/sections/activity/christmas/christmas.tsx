import Top from "@/sections/activity/christmas/sections/top";
import NFTProgress from "@/sections/activity/christmas/sections/progress";
import Summary from "@/sections/activity/christmas/sections/summary";
import GiftBox from "@/sections/activity/christmas/sections/gift-box";
import Quest from "@/sections/activity/christmas/sections/quest";
import { ChristmasContext } from "@/sections/activity/christmas/context";
import SwapModal from "@/sections/swap/SwapModal";
import { beraB } from "@/configs/tokens/bera-bArtio";
import { protocols, SnowToken } from "@/sections/activity/christmas/config";
import { useContext, useState } from "react";
import RulesModal from "./rules-modal";
import TotalPrizeModal from "./total-prize-modal";
import ChristmasSnow from "@/components/bear-background/home/christmas/snow";

const Christmas = () => {
  const { showSwapModal, setShowSwapModal } = useContext(ChristmasContext);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showTotalPrizeModal, setShowTotalPrizeModal] = useState(false);

  return (
    <div className="relative overflow-hidden">
      <ChristmasSnow className="!z-[0] max-h-[150vw]" />
      <div className="relative z-[1]">
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
        />
      </div>
    </div>
  );
};

export default Christmas;
