import DolomiteConfig from "@/configs/lending/dolomite";
import { getDappLogo, getTokenLogo } from "@/sections/dashboard/utils";
import { bera } from "@/configs/tokens/bera";

export enum ACTION_TYPE {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

export interface ActionType {
  button: string;
  title: string;
  value: ACTION_TYPE;
}

export const ActionTypes: Record<ACTION_TYPE, ActionType> = {
  [ACTION_TYPE.DEPOSIT]: {
    title: "Deposit Vaults",
    button: "Deposit",
    value: ACTION_TYPE.DEPOSIT
  },
  [ACTION_TYPE.WITHDRAW]: {
    title: "Withdraw Vaults",
    button: "Withdraw",
    value: ACTION_TYPE.WITHDRAW
  }
};

export enum ORDER_KEYS {
  TVL = "tvl",
  APY = "totalApy",
  YOURS = "balance"
}

export enum ORDER_DIRECTION {
  ASC = "asc",
  DESC = "desc"
}

export const OrderKeys: Record<
  ORDER_KEYS,
  { label: string; value: ORDER_KEYS }
> = {
  [ORDER_KEYS.TVL]: {
    label: "TVL",
    value: ORDER_KEYS.TVL
  },
  [ORDER_KEYS.APY]: {
    label: "APR",
    value: ORDER_KEYS.APY
  },
  [ORDER_KEYS.YOURS]: {
    label: "Yours",
    value: ORDER_KEYS.YOURS
  }
};

export const StrategyPool = "0x2c4a603a2aa5596287a06886862dc29d56dbc354";

export const SPECIAL_VAULTS = [
  // Bex - HONEY-USDC.e
  {
    vaultAddress: "0xf99be47baf0c22b7eb5eac42c8d91b9942dc7e84",
    poolType: "COMPOSABLE_STABLE"
  },
  // Dolomite - BERA
  {
    project: "Dolomite",
    config: {
      ...DolomiteConfig.basic,
      ...DolomiteConfig.networks["80094"]
    }
  }
];

export interface FilterItem {
  reg: RegExp;
  label: string;
  icon: string;
  sort: number;
  token?: {
    symbol: string;
    address: string;
    decimals: number;
  };
}

export enum FILTER_KEYS {
  ASSETS = "ASSETS",
  REWARDS = "REWARDS",
  PROTOCOLS = "PROTOCOLS",
  CREATORS = "CREATORS"
}

export const FILTERS: Record<FILTER_KEYS, FilterItem[]> = {
  [FILTER_KEYS.ASSETS]: [
    {
      reg: /^W?BERA$/i,
      label: "BERA",
      icon: getTokenLogo("BERA"),
      sort: 5,
      token: bera.bera
    },
    {
      reg: /^iBGT$/i,
      label: "iBGT",
      icon: getTokenLogo("iBGT"),
      sort: 8,
      token: bera.ibgt
    },
    {
      reg: /^HONEY$/i,
      label: "HONEY",
      icon: getTokenLogo("HONEY"),
      sort: 1,
      token: bera.honey
    },
    {
      reg: /^WETH$/i,
      label: "WETH",
      icon: getTokenLogo("WETH"),
      sort: 3,
      token: bera.weth
    },
    {
      reg: /^WBTC$/i,
      label: "WBTC",
      icon: getTokenLogo("WBTC"),
      sort: 7,
      token: bera.wbtc
    },
    {
      reg: /^NECT$/i,
      label: "NECT",
      icon: getTokenLogo("NECT"),
      sort: 10,
      token: bera.nect
    },
    {
      reg: /^USDC.e$/i,
      label: "USDC.e",
      icon: getTokenLogo("USDC.e"),
      sort: 2,
      token: bera["usdc.e"]
    },
    {
      reg: /^BM$/i,
      label: "BM",
      icon: getTokenLogo("BM"),
      sort: 11,
      token: bera["bm"]
    },
    {
      reg: /^RAMEN$/i,
      label: "RAMEN",
      icon: getTokenLogo("RAMEN"),
      sort: 12,
      token: bera["ramen"]
    },
    {
      reg: /^OHM$/i,
      label: "OHM",
      icon: getTokenLogo("OHM"),
      sort: 6,
      token: bera["ohm"]
    },
    {
      reg: /^DINERO$/i,
      label: "DINERO",
      icon: getTokenLogo("DINERO"),
      sort: 13,
      token: bera["dinero"]
    },
    {
      reg: /^stBGT$/i,
      label: "stBGT",
      icon: getTokenLogo("stBGT"),
      sort: 14,
      token: bera["stbgt"]
    },
    {
      reg: /^YEET$/i,
      label: "YEET",
      icon: getTokenLogo("YEET"),
      sort: 15,
      token: bera["yeet"]
    },
    {
      reg: /^SolvBTC/i,
      label: "SolvBTC",
      icon: getTokenLogo("SolvBTC"),
      sort: 16,
      token: bera["solvbtc"]
    },
    {
      reg: /^NAV$/i,
      label: "NAV",
      icon: getTokenLogo("NAV"),
      sort: 9,
      token: bera["nav"]
    },
    {
      reg: /^ezETH$/i,
      label: "ezETH",
      icon: getTokenLogo("ezETH"),
      sort: 17,
      token: bera["ez-eth"]
    },
    {
      reg: /^uniBTC$/i,
      label: "uniBTC",
      icon: getTokenLogo("uniBTC"),
      sort: 18,
      token: bera["unibtc"]
    },
    {
      reg: /^rUSD$/i,
      label: "rUSD",
      icon: getTokenLogo("rUSD"),
      sort: 19,
      token: bera["rusd"]
    },
    {
      reg: /^BITCOIN$/i,
      label: "BITCOIN",
      icon: getTokenLogo("BITCOIN"),
      sort: 20,
      token: bera["bitcoin"]
    },
    {
      reg: /^STONE$/i,
      label: "STONE",
      icon: getTokenLogo("STONE"),
      sort: 4,
      token: bera["stone"]
    },
    {
      reg: /^USDbr/i,
      label: "USDbr",
      icon: getTokenLogo("USDbr"),
      sort: 21,
      token: bera["usdbr"]
    }
    // { reg: /^STGUSDC$/i, label: "STGUSDC", icon: getTokenLogo("USDC"), token: bera.usdc },
  ],
  [FILTER_KEYS.REWARDS]: [
    { reg: /^BGT$/i, label: "BGT", icon: getTokenLogo("BGT"), sort: 1 },
    { reg: /^oBERO$/i, label: "oBERO", icon: getTokenLogo("oBERO"), sort: 2 },
    { reg: /^iBGT$/i, label: "iBGT", icon: getTokenLogo("iBGT"), sort: 3 },
    { reg: /^xKDK$/i, label: "xKDK", icon: getTokenLogo("xKDK"), sort: 4 },
    { reg: /^W?BERA$/i, label: "BERA", icon: getTokenLogo("BERA"), sort: 5 },
    {
      reg: /^BURR Points$/i,
      label: "BURR Points",
      icon: getTokenLogo("BURR Points"),
      sort: 6
    },
    { reg: /^HONEY$/i, label: "HONEY", icon: getTokenLogo("HONEY"), sort: 7 },
    { reg: /^gBERA$/i, label: "gBERA", icon: getTokenLogo("gBERA"), sort: 8 },
    { reg: /^USDbr$/i, label: "USDbr", icon: getTokenLogo("USDbr"), sort: 9 },
    { reg: /^NOME$/i, label: "NOME", icon: getTokenLogo("NOME"), sort: 10 }
  ],
  [FILTER_KEYS.PROTOCOLS]: [
    { reg: /^(Hub|Bex)$/i, label: "Bex", icon: getDappLogo("Bex"), sort: 1 },
    {
      reg: /^BeraDrome$/i,
      label: "BeraDrome",
      icon: getDappLogo("BeraDrome"),
      sort: 2
    },
    {
      reg: /^BurrBear$/i,
      label: "BurrBear",
      icon: getDappLogo("BurrBear"),
      sort: 3
    },
    { reg: /^WeBera$/i, label: "WeBera", icon: getDappLogo("WeBera"), sort: 4 },
    {
      reg: /^Infrared$/i,
      label: "Infrared",
      icon: getDappLogo("Infrared"),
      sort: 5
    },
    { reg: /^Kodiak$/i, label: "Kodiak", icon: getDappLogo("Kodiak"), sort: 6 },
    { reg: /^Smilee$/i, label: "Smilee", icon: getDappLogo("Smilee"), sort: 7 },
    {
      reg: /^Dolomite$/i,
      label: "Dolomite",
      icon: getDappLogo("Dolomite"),
      sort: 8
    },
    {
      reg: /^Memeswap$/i,
      label: "Memeswap",
      icon: getDappLogo("Memeswap"),
      sort: 9
    },
    { reg: /^Nome$/i, label: "Nome", icon: getDappLogo("Nome"), sort: 10 }
  ],
  [FILTER_KEYS.CREATORS]: [
    { reg: /^Bex$/i, label: "Bex", icon: getDappLogo("Bex"), sort: 1 },
    {
      reg: /^Infrared$/i,
      label: "Infrared",
      icon: getDappLogo("Infrared"),
      sort: 1
    },
    {
      reg: /^BeraPaw$/i,
      label: "BeraPaw",
      icon: getDappLogo("BeraPaw"),
      sort: 1
    },
    { reg: /^Dinero$/i, label: "Dinero", icon: getDappLogo("Dinero"), sort: 1 },
    { reg: /^Stride$/i, label: "Stride", icon: getDappLogo("Stride"), sort: 1 },
    {
      reg: /^Beradrome$/i,
      label: "Beradrome",
      icon: getDappLogo("Beradrome"),
      sort: 1
    },
    { reg: /^Smilee$/i, label: "Smilee", icon: getDappLogo("Smilee"), sort: 1 },
    {
      reg: /^Olympus$/i,
      label: "Olympus",
      icon: getDappLogo("Olympus"),
      sort: 1
    },
    {
      reg: /^Berapulg$/i,
      label: "Berapulg",
      icon: getDappLogo("Berapulg"),
      sort: 1
    },
    { reg: /^Yeet$/i, label: "Yeet", icon: getDappLogo("Yeet"), sort: 1 },
    { reg: /^Kodiak$/i, label: "Kodiak", icon: getDappLogo("Kodiak"), sort: 1 },
    {
      reg: /^SolvProtocol$/i,
      label: "SolvProtocol",
      icon: getDappLogo("SolvProtocol"),
      sort: 1
    },
    { reg: /^NAV$/i, label: "NAV", icon: getDappLogo("NAV"), sort: 1 },
    { reg: /^Renzo$/i, label: "Renzo", icon: getDappLogo("Renzo"), sort: 1 },
    {
      reg: /^Bedrock$/i,
      label: "Bedrock",
      icon: getDappLogo("Bedrock"),
      sort: 1
    },
    {
      reg: /^Holdstation$/i,
      label: "Holdstation",
      icon: getDappLogo("Holdstation"),
      sort: 1
    },
    {
      reg: /^Reservoir$/i,
      label: "Reservoir",
      icon: getDappLogo("Reservoir"),
      sort: 1
    },
    {
      reg: /^Avalon Labs$/i,
      label: "Avalon Labs",
      icon: getDappLogo("Avalon Labs"),
      sort: 1
    },
    {
      reg: /^HPOS10I$/i,
      label: "HPOS10I",
      icon: getDappLogo("HPOS10I"),
      sort: 1
    },
    {
      reg: /^Beramonium$/i,
      label: "Beramonium",
      icon: getDappLogo("Beramonium"),
      sort: 1
    },
    {
      reg: /^StakeStone$/i,
      label: "StakeStone",
      icon: getDappLogo("StakeStone"),
      sort: 1
    },
    { reg: /^BM$/i, label: "BM", icon: getDappLogo("BM"), sort: 1 },
    { reg: /^Ramen$/i, label: "Ramen", icon: getDappLogo("Ramen"), sort: 1 },
    { reg: /^Bulla$/i, label: "Bulla", icon: getDappLogo("Bulla"), sort: 1 },
    {
      reg: /^BurrBear$/i,
      label: "BurrBear",
      icon: getDappLogo("BurrBear"),
      sort: 1
    },
    { reg: /^WeBera$/i, label: "WeBera", icon: getDappLogo("WeBera"), sort: 1 },
    {
      reg: /^Dolomite$/i,
      label: "Dolomite",
      icon: getDappLogo("Dolomite"),
      sort: 1
    },
    {
      reg: /^Memeswap$/i,
      label: "Memeswap",
      icon: getDappLogo("Memeswap"),
      sort: 1
    },
    { reg: /^Nome$/i, label: "Nome", icon: getDappLogo("Nome"), sort: 1 }
  ]
};

export enum PAGINATION_ACTION {
  FIRST = "first",
  PREV = "previous",
  NEXT = "next",
  LAST = "last"
}
