"use client";

import { LootboxSeasonGuides, useLootboxSeason } from "@/hooks/use-lootbox-season";
import LootboxSeasonStartModal from "./sections/start/modal";
import LootboxSeasonOpenModal from "./sections/open/modal";
import LootboxSeasonGemsModal from "./sections/gems/modal";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import LootboxSeasonGuide from "./sections/guide";

const LootboxSeason = (props: any) => {
  const { } = props;

  const {
    open,
    onModalToggle,
    onOpenLootbox,
    openLootboxPending,
    onFinish,
    account,
    guideVisible,
    setGuideVisible,
    onFinishGuide,
  } = useLootboxSeason();
  const connectModal = useConnectModal();

  return (
    <>
      <LootboxSeasonStartModal
        open={open.start}
        onClose={() => {
          onFinish(false);
        }}
        onNext={() => {
          if (!account) {
            connectModal.openConnectModal?.();
            return;
          }
          onModalToggle(LootboxSeasonGuides.Open, true);
        }}
      />
      <LootboxSeasonOpenModal
        open={open.open}
        onClose={() => {
          onFinish(false);
        }}
        onNext={onOpenLootbox}
        loading={openLootboxPending}
      />
      <LootboxSeasonGemsModal
        open={open.gems}
        onClose={() => {
          onFinish(false);
        }}
        points={100}
        onNext={onFinish}
      />
      <LootboxSeasonGuide
        open={guideVisible}
        onClose={onFinishGuide}
      />
    </>
  );
};

export default LootboxSeason;
