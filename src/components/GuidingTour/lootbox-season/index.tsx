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
    userCategoryList,
    setUserCategoryList,
    hadUserCategory,
    lootboxOpenedData,
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
          if (hadUserCategory) {
            onFinish(true);
            return;
          }
          onModalToggle(LootboxSeasonGuides.Open, true);
        }}
        hadUserCategory={hadUserCategory}
      />
      <LootboxSeasonOpenModal
        open={open.open}
        onClose={() => {
          onFinish(false);
        }}
        onNext={onOpenLootbox}
        loading={openLootboxPending}
        userCategoryList={userCategoryList}
        setUserCategoryList={setUserCategoryList}
      />
      <LootboxSeasonGemsModal
        open={open.gems}
        onClose={() => {
          onFinish(false);
        }}
        data={lootboxOpenedData}
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
