import { ModuleType, ModuleConfig } from "./components/Module";
const KODIAK_DAPP = {
  icon: '/images/dapps/kodiak.svg',
  name: 'Kodiak',
  link: '/dex/kodiak'
}
const BEX_DAPP = {
  icon: '/images/dapps/bex.svg',
  name: 'Bex',
  link: '/dex/bex'
}
const OOGA_BOOGA_DAPP = {
  icon: '/images/dapps/ooga-booga.svg',
  name: 'Ooga Booga',
  link: '/dex/ooga-booga'
}
const DOLOMITE_DAPP = {
  icon: '/images/dapps/dolomite.svg',
  name: 'Dolomite',
  link: '/lending/dolomite'
}
const BERABORROW_DAPP = {
  icon: '/images/dapps/beraborrow.png',
  name: 'Beraborrow',
  link: '/lending/beraborrow'
}
const STARGATE_DAPP = {
  icon: '/images/dapps/stargate.svg',
  name: 'Stargate',
  link: '/bridge/Stargate'
}
const BINTENT_DAPP = {
  icon: '/images/campaign/bintent.png',
  name: 'Bintent',
  link: '/lending/beraborrow'
}
export const ModuleConfigs: Record<ModuleType, ModuleConfig> = {
  hats: {
    type: "hats",
    styles: {
      container: "absolute flex items-center w-[96.417vw] -top-[17.435vw]",
    },
    items: [
      {
        id: "hats-1",
        icon: "/images/mobile/cave/hats/hats-1.png",
        popoverIcon: "/images/mobile/cave/hats/hats-1-m.png",
        title: "Baseball Cap",
        desc: "5 transactions, at least $1+ for each.",
        type: "Swap",
        hasPopover: true,
        styles: {
          image: "w-[16.358vw]",
          imageWrapper: "flex items-end w-[19.283vw] h-[17.435vw]",
        },
        link: '/dex/kodiak',
        dapps: []
      },
      {
        id: "hats-5",
        icon: "/images/mobile/cave/hats/hats-5.png",
        popoverIcon: "/images/mobile/cave/hats/hats-5-m.png",
        title: "Baseball Cap",
        desc: "Swap over 5 transactions, at least $10+ for each ",
        type: "Swap",
        hasPopover: true,
        styles: {
          image: "w-[14.871vw]",
          imageWrapper: "flex items-end w-[19.283vw] h-[17.435vw]",
        },
        link: '/dex/bex',
      },
      {
        id: "hats-2",
        icon: "/images/mobile/cave/hats/hats-2.png",
        popoverIcon: "/images/mobile/cave/hats/hats-2-m.png",
        title: "Basic Helmet",
        desc: "Swap over 10 transactions, at least $50+ for each",
        type: "Swap",
        hasPopover: true,
        styles: {
          image: "w-[16.358vw]",
          imageWrapper: "flex items-end w-[19.283vw] h-[17.435vw]",
        },
        link: '/dex/ooga-booga',
      },
      {
        id: "hats-3",
        icon: "/images/mobile/cave/hats/hats-3.png",
        popoverIcon: "/images/mobile/cave/hats/hats-3-m.png",
        title: "Flying Helmet",
        desc: "Swap over 20 transactions, at least $100+ for each",
        type: "Swap",
        hasPopover: true,
        styles: {
          image: "w-[16.358vw]",
          imageWrapper: "flex items-end w-[19.283vw] h-[17.435vw]",
        },
        dapps: [KODIAK_DAPP, BEX_DAPP, OOGA_BOOGA_DAPP],
      },
      {
        id: "hats-4",
        icon: "/images/mobile/cave/hats/hats-4.png",
        popoverIcon: "/images/mobile/cave/hats/hats-4-m.png",
        title: "Motor Helmet",
        desc: "Swap over 50 transactions, at least $100+ for each",
        type: "Swap",
        hasPopover: true,
        styles: {
          image: "w-[16.358vw]",
          imageWrapper: "flex items-end w-[19.283vw] h-[17.435vw]",
        },
        dapps: [KODIAK_DAPP, BEX_DAPP, OOGA_BOOGA_DAPP],
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
        desc: "Provide 100$ worth of LP of to any pair  (1-time)",
        type: "Liquidty",
        hasPopover: true,
        dapps: [KODIAK_DAPP, BEX_DAPP],
      },
      {
        id: "jackets-2",
        icon: "/images/mobile/cave/jackets/jackets-2.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-2-m.png",
        title: "Baseball Jacket",
        desc: "Provide 420$ worth of LP to any pair (1-time)",
        type: "Liquidty",
        hasPopover: true,
        dapps: [KODIAK_DAPP, BEX_DAPP],
      },
      {
        id: "jackets-3",
        icon: "/images/mobile/cave/jackets/jackets-3.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-3-m.png",
        title: "Vintage Jacket",
        desc: "Provide 2000$ worth of LP to any pair (1-time)",
        type: "Liquidty",
        hasPopover: true,
        dapps: [KODIAK_DAPP, BEX_DAPP],
      },
      {
        id: "jackets-4",
        icon: "/images/mobile/cave/jackets/jackets-4.png",
        popoverIcon: "/images/mobile/cave/jackets/jackets-4-m.png",
        title: "Windcheater",
        desc: "Provide 5000$ worth of LP to any pair (1-time)",
        type: "Liquidty",
        hasPopover: true,
        dapps: [KODIAK_DAPP, BEX_DAPP],
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
        desc: "Lend over 5 transactions, at least $100+ for each",
        type: "Lending",
        hasPopover: true,
        link: DOLOMITE_DAPP?.link,
      },
      {
        id: "necklaces-2",
        icon: "/images/mobile/cave/necklaces/necklaces-2.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-2-m.png",
        title: "Silver Necklace",
        desc: "Lend over 10 transactions, at least $100+ for each",
        type: "Lending",
        hasPopover: true,
        link: BERABORROW_DAPP?.link,
      },
      {
        id: "necklaces-3",
        icon: "/images/mobile/cave/necklaces/necklaces-3.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-3-m.png",
        title: "Golden Necklace",
        desc: "Lend over 20 transactions, at least $100+ for each",
        type: "Lending",
        hasPopover: true,
        dapps: [DOLOMITE_DAPP, BERABORROW_DAPP],
      },
      {
        id: "necklaces-4",
        icon: "/images/mobile/cave/necklaces/necklaces-4.png",
        popoverIcon: "/images/mobile/cave/necklaces/necklaces-4-m.png",
        title: "Diamond Necklace",
        desc: "Lend over 50 transactions, at least $100+ for each",
        type: "Lending",
        hasPopover: true,
        dapps: [DOLOMITE_DAPP, BERABORROW_DAPP],
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
        desc: "Bridge over 5 transactions, at least $10+ for each Or Swap over 5 transactions, at least $10+ for each on Bintent",
        type: "Bridge or bintent",
        hasPopover: true,
        dapps: [STARGATE_DAPP, BINTENT_DAPP],
      },
      {
        id: "cars-2",
        icon: "/images/mobile/cave/cars/cars-2.png",
        popoverIcon: "/images/mobile/cave/cars/cars-2-m.png",
        title: "Vehicle",
        desc: "Bridge over 10 transactions, at least $50+ for each Or Swap over 10 transactions, at least $50+ for each on Bintent",
        type: "Bridge or bintent",
        hasPopover: true,
        dapps: [STARGATE_DAPP, BINTENT_DAPP],
      },
      {
        id: "cars-3",
        icon: "/images/mobile/cave/cars/cars-3.png",
        popoverIcon: "/images/mobile/cave/cars/cars-3-m.png",
        title: "Motocycle",
        desc: "Bridge over 20 transactions, at least $100+ for each Or Swap over 20 transactions, at least $100+ for each on Bintent",
        type: "Bridge or bintent",
        hasPopover: true,
        dapps: [STARGATE_DAPP, BINTENT_DAPP],
      },
      {
        id: "cars-4",
        icon: "/images/mobile/cave/cars/cars-4.png",
        popoverIcon: "/images/mobile/cave/cars/cars-4-m.png",
        title: "Race Car",
        desc: "Bridge over 50 transactions, at least $100+ for each Or Swap over 50 transactions, at least $100+ for each on Bintent",
        type: "Bridge or bintent",
        hasPopover: true,
        dapps: [STARGATE_DAPP, BINTENT_DAPP],
      },
    ],
  },
  pets: {
    type: "pets",
    styles: {
      container: "absolute f w-[96.417vw]",
      imageWrapper: "flex-1",
      image: "w-[24.358vw] h-[42.051vw]",
      imagePopover: "w-[16.667vw] h-[22.051vw]",
    },
    items: [
      {
        id: "pets-1",
        icon: "/images/mobile/cave/pets/pets-1.png",
        popoverIcon: "/images/mobile/cave/pets/pets-1-m.png",
        title: "Aeris",
        desc: "Add 100$ worth of tLP to a BGT vault (1-time)",
        type: "Stake in Vaults",
        hasPopover: true,
        styles: {
          image: "absolute left-[14.359vw] top-[4.615vw] w-[21.666vw]"
        },
        link: '/vaults',
      },
      {
        id: "pets-2",
        icon: "/images/mobile/cave/pets/pets-2.png",
        popoverIcon: "/images/mobile/cave/pets/cars-2-m.png",
        title: "Luma",
        desc: "Deposit 420$ to an Infrared vault (1-time)",
        type: "Stake in Vaults",
        hasPopover: true,
        styles: {
          image: "absolute left-[57.949vw] top-[4.615vw] w-[24.102vw]"
        },
        link: '/vaults',
      },
      {
        id: "pets-3",
        icon: "/images/mobile/cave/pets/pets-3.png",
        popoverIcon: "/images/mobile/cave/pets/cars-3-m.png",
        title: "Noa",
        desc: "Deposit 2000$ to any vault in the Vaults page (1-time)",
        type: "Stake in Vaults",
        hasPopover: true,
        styles: {
          image: "absolute left-[13.230vw] top-[27.436vw] w-[23.846vw]"
        },
        link: '/vaults',
      },
      {
        id: "pets-4",
        icon: "/images/mobile/cave/pets/pets-4.png",
        popoverIcon: "/images/mobile/cave/pets/pets-4-m.png",
        title: "Saffi",
        desc: "Deposit 5000$ to any vault in the Vaults page (1-time)",
        type: "Stake in Vaults",
        hasPopover: true,
        styles: {
          image: "absolute left-[56.410vw] top-[27.179vw] w-[25.666vw]"
        },
        link: '/vaults',
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