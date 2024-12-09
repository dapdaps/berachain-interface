import Top from "@/sections/activity/christmas/sections/top";
import NFTProgress from "@/sections/activity/christmas/sections/progress";
import Summary from "@/sections/activity/christmas/sections/summary";
import GiftBox from "@/sections/activity/christmas/sections/gift-box";
import Quest from "@/sections/activity/christmas/sections/quest";
import SceneContextProvider from "@/sections/activity/christmas/context";
import RulesModal from "./rules-modal";
import TotalPrizeModal from "./total-prize-modal";
import { useState } from "react";

export default function Christmas() {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showTotalPrizeModal, setShowTotalPrizeModal] = useState(false);
  return (
    <SceneContextProvider>
      <div className="">
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
      </div>

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
    </SceneContextProvider>
  );
}
