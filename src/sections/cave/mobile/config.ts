import { ModuleType, ModuleConfig } from "./components/Module";

export const ModuleConfigs: Record<ModuleType, ModuleConfig> = {
  hat: {
    type: "hat",
    styles: {
      container: "absolute flex items-center w-[96.417vw] -top-[17.435vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[19.23vw]",
    },
    items: [
      {
        id: "hat-1",
        icon: "/images/mobile/cave/hat/hat-1.png",
        popoverIcon: "/images/mobile/cave/hat/hat-1-m.png",
        title: "Baseball Cap",
        desc: "Bridge $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
        type: "bridge",
        hasPopover: true,
        needTransactionNums: 1,
      },
      {
        id: "hat-2",
        icon: "/images/mobile/cave/hat/hat-2.png",
        popoverIcon: "/images/mobile/cave/hat/hat-2-m.png",
        title: "Baseball Cap",
        desc: "Bridge $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
        type: "bridge",
        hasPopover: true,
        needTransactionNums: 10,
      },
      {
        id: "hat-3",
        icon: "/images/mobile/cave/hat/hat-3.png",
        popoverIcon: "/images/mobile/cave/hat/hat-3-m.png",
        title: "Baseball Cap",
        desc: "Bridge $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
        type: "bridge",
        hasPopover: true,
        needTransactionNums: 100,
      },
      {
        id: "hat-4",
        icon: "/images/mobile/cave/hat/hat-4.png",
        popoverIcon: "/images/mobile/cave/hat/hat-4-m.png",
        title: "Baseball Cap",
        desc: "Bridge $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
        type: "bridge",
        hasPopover: true,
        needTransactionNums: 1000,
      },
    ],
  },
  jacket: {
    type: "jacket",
    styles: {
      container: "absolute flex items-center w-[96.417vw] top-[9.23vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
    },
    items: [
      {
        id: "jacket-1",
        icon: "/images/mobile/cave/jacket/jacket-1.png",
        popoverIcon: "/images/mobile/cave/jacket/jacket-1-m.png",
        title: "Hoodie",
        desc: "Swap $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
        type: "swap",
        hasPopover: true,
        needTransactionNums: 1,
      },
        {
            id: "jacket-2",
            icon: "/images/mobile/cave/jacket/jacket-2.png",
            popoverIcon: "/images/mobile/cave/jacket/jacket-2-m.png",
            title: "Hoodie",
            desc: "Swap $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
            type: "swap",
            hasPopover: true,
            needTransactionNums: 10,
        },
        {
            id: "jacket-3",
            icon: "/images/mobile/cave/jacket/jacket-3.png",
            popoverIcon: "/images/mobile/cave/jacket/jacket-3-m.png",
            title: "Hoodie",
            desc: "Swap $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
            type: "swap",
            hasPopover: true,
            needTransactionNums: 100,
        },
        {
            id: "jacket-4",
            icon: "/images/mobile/cave/jacket/jacket-4.png",
            popoverIcon: "/images/mobile/cave/jacket/jacket-4-m.png",
            title: "Hoodie",
            desc: "Swap $100+ per transaction, complete at least $TRANSACTION_COUNT transaction.",
            type: "swap",
            hasPopover: true,
            needTransactionNums: 1000,
        },
    ],
  },
  jewelry: {
    type: "jewelry",
    styles: {
      container: "absolute flex items-center w-[96.417vw] -top-[12.435vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
    },
    items: [
      // 珠宝配置项
    ],
  },
  key: {
    type: "key",
    styles: {
      container: "absolute flex items-center w-[96.417vw] -top-[15.435vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
    },
    items: [
      // 钥匙配置项
    ],
  },
};
