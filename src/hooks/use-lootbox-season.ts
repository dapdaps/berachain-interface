import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import useToast from "./use-toast";
import useAccount from "./use-account";
import { useEffect, useState } from "react";
import { useDebounceFn, useRequest } from "ahooks";
import { usePathname } from "next/navigation";

export function useLootboxSeason(props?: any) {
  const { } = props ?? {};

  const {
    visited,
    setVisited,
    treasureBookOpen,
    setTreasureBookOpen,
    guideVisited,
    setGuideVisited,
  } = useLootboxSeasonStore();
  const toast = useToast();
  const { account, accountWithAk } = useAccount();
  const pathname = usePathname();

  const [open, setOpen] = useState<Record<LootboxSeasonGuides, boolean>>({
    [LootboxSeasonGuides.Start]: false,
    [LootboxSeasonGuides.Open]: false,
    [LootboxSeasonGuides.Gems]: false,
  });

  const onModalToggle = (type: LootboxSeasonGuides, open: boolean) => {
    setOpen((prev) => {
      const _open: any = { ...prev };
      for (const key in _open) {
        _open[key] = key === type ? open : false;
      }
      return _open;
    });
  };

  const { run: onModalToggleDelay, cancel: onModalToggleCancel } = useDebounceFn(() => {
    onModalToggle(LootboxSeasonGuides.Start, true);
  }, { wait: 2000 });

  const { runAsync: onOpenLootbox, loading: openLootboxPending } = useRequest(async () => {
    const mockReq = () => new Promise((resolve) => {
      const timer = setTimeout(() => {
        resolve({});
        clearTimeout(timer);
      }, 1500);
    });
    await mockReq();

    // open gems modal
    onModalToggle(LootboxSeasonGuides.Gems, true);
  }, {
    manual: true,
  });

  const onFinish = (isOpenTreasureBook = true) => {
    onModalToggle(LootboxSeasonGuides.Gems, false);
    setVisited(account, true);
    if (isOpenTreasureBook) {
      setTreasureBookOpen(true);
      return;
    }
    setGuideVisible(true);
  };

  useEffect(() => {
    if (pathname !== '/') return

    onModalToggleCancel();

    const _visited = visited[account || 'DEFAULT'];
    if (_visited) {
      onModalToggle(LootboxSeasonGuides.Start, false);
      return;
    }

    onModalToggleDelay();
  }, [visited, account, pathname]);

  const [guideVisible, setGuideVisible] = useState<boolean>(false);

  const { run: setGuideVisibleDelay, cancel: setGuideVisibleCancel } = useDebounceFn(() => {
    setGuideVisible(true);
  }, { wait: 2000 });

  const onFinishGuide = () => {
    setGuideVisible(false);
    setGuideVisited(account, true);
  };

  useEffect(() => {
    if (pathname !== '/') return

    setGuideVisibleCancel();

    const _visited = visited[account || 'DEFAULT'];

    if (!_visited || treasureBookOpen) {
      setGuideVisible(false);
      return;
    }

    const _guideVisited = guideVisited[account || 'DEFAULT'];
    if (_guideVisited) {
      setGuideVisible(false);
      return;
    }

    setGuideVisibleDelay();
  }, [visited, guideVisited, account, pathname, treasureBookOpen]);

  return {
    open,
    onModalToggle,
    onOpenLootbox,
    openLootboxPending,
    onFinish,
    account,
    guideVisible,
    setGuideVisible,
    onFinishGuide,
  };
};

export enum LootboxSeasonGuides {
  Start = "start",
  Open = "open",
  Gems = "gems",
}
