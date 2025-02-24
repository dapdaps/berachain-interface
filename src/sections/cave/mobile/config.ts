import { ModuleType, ModuleConfig } from "./components/Module";

export const ModuleConfigs: Record<ModuleType, ModuleConfig> = {
  hats: {
    type: "hats",
    styles: {
      container: "absolute flex items-center w-[96.417vw] -top-[17.435vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[19.23vw]",
      imagePopover: "w-[19.62vw] h-[17.648vw]"
    },
    items: [
      {
        id: "hats-1",
        icon: "/images/mobile/cave/hats/hats-1.png",
        popoverIcon: "/images/mobile/cave/hats/hats-1-m.png",
        title: "Baseball Cap",
        desc: "5 transactions, at least $1+ for each.",
        type: "bridge",
        hasPopover: true,
      },
      {
        id: "hats-2",
        icon: "/images/mobile/cave/hats/hats-2.png",
        popoverIcon: "/images/mobile/cave/hats/hats-2-m.png",
        title: "Basic Helmet",
        desc: "10 transactions, at least $10+ for each.",
        type: "bridge",
        hasPopover: true,
      },
      {
        id: "hats-3",
        icon: "/images/mobile/cave/hats/hats-3.png",
        popoverIcon: "/images/mobile/cave/hats/hats-3-m.png",
        title: "Flying Helmet",
        desc: "50 transactions, at least $100+ for each.",
        type: "bridge",
        hasPopover: true,
      },
      {
        id: "hats-4",
        icon: "/images/mobile/cave/hats/hats-4.png",
        popoverIcon: "/images/mobile/cave/hats/hats-4-m.png",
        title: "Motor Helmet",
        desc: "200 transactions, at least $100+ for each.",
        type: "bridge",
        hasPopover: true,
      },
    ],
  },
  jackets: {
    type: "jackets",
    styles: {
      container: "absolute flex items-center w-[96.417vw] top-[9.23vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
      imagePopover: "w-[12.82vw] h-[23.076vw]"
    },
    items: [
      {
        id: "jackets-1",
        icon: "/images/mobile/cave/jackets/jackets-1.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-1-m.png",
        title: "Hoodie",
        desc: "5 transaction, at least $1+ for each.",
        type: "swap",
        hasPopover: true,
      },
      {
        id: "jackets-2",
        icon: "/images/mobile/cave/jackets/jackets-2.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-2-m.png",
        title: "Baseball Jacket",
        desc: "10 transaction, at least $10+ for each.",
        type: "swap",
        hasPopover: true,
      },
      {
        id: "jackets-3",
        icon: "/images/mobile/cave/jackets/jackets-3.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-3-m.png",
        title: "Vintage Jacket",
        desc: "50 transaction, at least $100+ for each.",
        type: "swap",
        hasPopover: true,
      },
      {
        id: "jackets-4",
        icon: "/images/mobile/cave/jackets/jackets-4.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-4-m.png",
        title: "Windcheater",
        desc: "200 transaction, at least $100+ for each.",
        type: "swap",
        hasPopover: true,
      },
    ],
  },
  necklaces: {
    type: "necklaces",
    styles: {
      container: "absolute flex items-center w-[96.417vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
      imagePopover: "w-[16.667vw] h-[22.051vw]",
    },
    items: [
      {
        id: "necklaces-1",
        icon: "/images/mobile/cave/necklaces/necklaces-1.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-1-m.png",
        title: "Alloy Necklace",
        desc: "20 transactions, at least $100+ for each.",
        type: "lend",
        hasPopover: true,
      },
      {
        id: "necklaces-2",
        icon: "/images/mobile/cave/necklaces/necklaces-2.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-2-m.png",
        title: "Silver Necklace",
        desc: "100 transactions, at least $100+ for each.",
        type: "lend",
        hasPopover: true,
      },
      {
        id: "necklaces-3",
        icon: "/images/mobile/cave/necklaces/necklaces-3.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-3-m.png",
        title: "Golden Necklace",
        desc: "200 transactions, at least $100+ for each.",
        type: "lend",
        hasPopover: true,
      },
      {
        id: "necklaces-4",
        icon: "/images/mobile/cave/necklaces/necklaces-4.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-4-m.png",
        title: "Diamond Necklace",
        desc: "300 transactions, at least $100+ for each.",
        type: "lend",
        hasPopover: true,
      },
    ],
  },
  cars: {
    type: "cars",
    styles: {
      container: "absolute flex items-center w-[96.417vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
      imagePopover: "w-[16.667vw] h-[22.051vw]",
    },
    items: [
      {
        id: "cars-1",
        icon: "/images/mobile/cave/cars/cars-1.png",
        popoverIcon: "/images/mobile/cave/cars/cars-1-m.png",
        title: "Bicycle",
        desc: "Bicycle, Delegate 1 BGT",
        type: "delegate",
        hasPopover: true,
      },
      {
        id: "cars-2",
        icon: "/images/mobile/cave/cars/cars-2.png",
        popoverIcon: "/images/mobile/cave/cars/cars-2-m.png",
        title: "Vehicle",
        desc: "Scooter, Delegate 100 BGT",
        type: "delegate",
        hasPopover: true,
      },
      {
        id: "cars-3",
        icon: "/images/mobile/cave/cars/cars-3.png",
        popoverIcon: "/images/mobile/cave/cars/cars-3-m.png",
        title: "Motocycle",
        desc: "Motobike, Delegate 10,000 BGT",
        type: "delegate",
        hasPopover: true,
      },
      {
        id: "cars-4",
        icon: "/images/mobile/cave/cars/cars-4.png",
        popoverIcon: "/images/mobile/cave/cars/cars-4-m.png",
        title: "Race Car",
        desc: "Lambo, Delegate 1,000,000 BGT",
        type: "delegate",
        hasPopover: true,
      },
    ],
  },
};


export const ItemsConfigs = [
  {
    category: 'elf_hat',
    name: 'Elf’s Hat',
  },
  {
    category: 'santa_hat',
    name: 'Santa Hat',
  },
  {
    category: 'elf_jacket',
    name: 'Elf’s Jacket',
  },
  {
    category: 'santa_coat',
    name: 'Santa Coat',
  },
  {
    category: 'scarf',
    name: 'Scarf',

  },
  {
    category: 'sleigh',
    name: 'Sleigh',
  },
  {
    category: 'snowboard',
    name: 'Snowboard',
  },
]