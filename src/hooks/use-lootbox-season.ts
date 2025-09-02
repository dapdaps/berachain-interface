import { useLootboxSeasonStore } from "@/stores/use-lootbox-season";
import useToast from "./use-toast";
import useAccount from "./use-account";
import { useEffect, useMemo, useState } from "react";
import { useDebounceFn, useRequest } from "ahooks";
import { usePathname } from "next/navigation";
import { post } from "@/utils/http";
import { useUserStore } from "@/stores/user";
import useUser from "./use-user";

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
  const userInfo = useUserStore((store: any) => store.user);
  const setUserInfo = useUserStore((store: any) => store.set);

  const [open, setOpen] = useState<Record<LootboxSeasonGuides, boolean>>({
    [LootboxSeasonGuides.Start]: false,
    [LootboxSeasonGuides.Open]: false,
    [LootboxSeasonGuides.Gems]: false,
  });

  const [hadUserCategory] = useMemo(() => {
    return [userInfo?.category > 0];
  }, [userInfo]);

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

  const [userCategoryList, setUserCategoryList] = useState([
    {
      key: 1,
      label: "Yield Farmer",
      description: "Show me the highest APY",
      selected: false,
      code: 1,
    },
    {
      key: 2,
      label: "DeFi Curious",
      description: "Help me explore DeFi",
      selected: false,
      code: 2,
    },
    {
      key: 3,
      label: "Cross-chain Explorer",
      description: "I want to bridge and swap",
      selected: false,
      code: 3,
    },
    {
      key: 4,
      label: "Berachain Baller",
      description: "Here for the vibes",
      selected: true,
      code: 4,
    },
    {
      key: 5,
      label: "First Timer",
      description: "I’m new, help me start",
      selected: false,
      code: 5,
    },
  ]);
  const { runAsync: onOpenLootbox, loading: openLootboxPending, data: lootboxOpenedData } = useRequest(async () => {
    const currCategory = userCategoryList.find((it: any) => it.selected)?.code;
    const res = await post("/api/go/user/category", {
      category: currCategory,
    });
    if (res.code !== 200) {
      toast.fail({ title: res.message });
      return;
    }

    // refresh user info
    setUserInfo({ user: { ...userInfo, category: currCategory } });

    // open box
    const resBox = await post("/api/go/treasure/draw", {
      box_amount: 1,
    });
    if (resBox.code !== 200) {
      onFinish();
      return;
    }

    // open gems modal
    onModalToggle(LootboxSeasonGuides.Gems, true);

    return resBox.data;
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
    if (pathname !== '/') return;

    if (account && !userInfo) {
      return;
    }

    onModalToggleCancel();

    const _visited = visited[account || 'DEFAULT'];
    if (_visited || hadUserCategory) {
      onModalToggle(LootboxSeasonGuides.Start, false);
      return;
    }

    onModalToggleDelay();
  }, [visited, account, pathname, hadUserCategory, userInfo]);

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
    userCategoryList,
    setUserCategoryList,
    hadUserCategory,
    lootboxOpenedData,
  };
};

export enum LootboxSeasonGuides {
  Start = "start",
  Open = "open",
  Gems = "gems",
}
