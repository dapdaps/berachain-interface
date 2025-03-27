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
    label: "APY",
    value: ORDER_KEYS.APY
  },
  [ORDER_KEYS.YOURS]: {
    label: "Yours",
    value: ORDER_KEYS.YOURS
  }
};

export const StrategyPool = {
  tokens: [
    {
      icon: "/assets/tokens/wbera.png",
      symbol: "WBERA",
      decimals: 18,
      address: "0x6969696969696969696969696969696969696969"
    },
    {
      icon: "/assets/tokens/honey.svg",
      symbol: "HONEY",
      decimals: 18,
      address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce"
    }
  ],
  protocol: "Hub",
  protocolIcon: "https://assets.db3.app/dapp/bex.png",
  lpProtocol: "Bex",
  token: {
    symbol: "WBERA-HONEY",
    address: "0x2c4a603a2aa5596287a06886862dc29d56dbc354",
    decimals: 18
  },
  vaultAddress: "0xc2baa8443cda8ebe51a640905a8e6bc4e1f9872c",
  id: "0x2c4a603a2aa5596287a06886862dc29d56dbc354000200000000000000000002",
  poolType: "WEIGHTED"
};

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
      token: bera.bera
    },
    {
      reg: /^iBGT$/i,
      label: "iBGT",
      icon: getTokenLogo("iBGT"),
      token: bera.ibgt
    },
    {
      reg: /^HONEY$/i,
      label: "HONEY",
      icon: getTokenLogo("HONEY"),
      token: bera.honey
    },
    {
      reg: /^WETH$/i,
      label: "WETH",
      icon: getTokenLogo("WETH"),
      token: bera.weth
    },
    {
      reg: /^WBTC$/i,
      label: "WBTC",
      icon: getTokenLogo("WBTC"),
      token: bera.wbtc
    },
    {
      reg: /^NECT$/i,
      label: "NECT",
      icon: getTokenLogo("NECT"),
      token: bera.nect
    },
    {
      reg: /^USDC.e$/i,
      label: "USDC.e",
      icon: getTokenLogo("USDC.e"),
      token: bera["usdc.e"]
    }
    // { reg: /^STGUSDC$/i, label: "STGUSDC", icon: getTokenLogo("USDC"), token: bera.usdc },
  ],
  [FILTER_KEYS.REWARDS]: [
    { reg: /^BGT$/i, label: "BGT", icon: getTokenLogo("BGT") },
    { reg: /^oBERO$/i, label: "oBERO", icon: getTokenLogo("oBERO") },
    { reg: /^iBGT$/i, label: "iBGT", icon: getTokenLogo("iBGT") },
    { reg: /^xKDK$/i, label: "xKDK", icon: getTokenLogo("xKDK") },
    { reg: /^W?BERA$/i, label: "BERA", icon: getTokenLogo("BERA") },
    {
      reg: /^BURR Points$/i,
      label: "BURR Points",
      icon: getTokenLogo("BURR Points")
    },
    { reg: /^HONEY$/i, label: "HONEY", icon: getTokenLogo("HONEY") },
    { reg: /^gBERA$/i, label: "gBERA", icon: getTokenLogo("gBERA") },
    { reg: /^USDbr$/i, label: "USDbr", icon: getTokenLogo("USDbr") },
    { reg: /^NOME$/i, label: "NOME", icon: getTokenLogo("NOME") }
  ],
  [FILTER_KEYS.PROTOCOLS]: [
    { reg: /^Bex$/i, label: "Bex", icon: getDappLogo("Bex") },
    { reg: /^BeraDrome$/i, label: "BeraDrome", icon: getDappLogo("BeraDrome") },
    { reg: /^BurrBear$/i, label: "BurrBear", icon: getDappLogo("BurrBear") },
    { reg: /^WeBera$/i, label: "WeBera", icon: getDappLogo("WeBera") },
    { reg: /^Infrared$/i, label: "Infrared", icon: getDappLogo("Infrared") },
    { reg: /^Kodiak$/i, label: "Kodiak", icon: getDappLogo("Kodiak") },
    { reg: /^Smilee$/i, label: "Smilee", icon: getDappLogo("Smilee") },
    { reg: /^Dolomite$/i, label: "Dolomite", icon: getDappLogo("Dolomite") },
    { reg: /^Memeswap$/i, label: "Memeswap", icon: getDappLogo("Memeswap") },
    { reg: /^Nome$/i, label: "Nome", icon: getDappLogo("Nome") }
  ],
  [FILTER_KEYS.CREATORS]: [
    { reg: /^Bex$/i, label: "Bex", icon: getDappLogo("Bex") },
    { reg: /^Infrared$/i, label: "Infrared", icon: getDappLogo("Infrared") },
    { reg: /^BeraPaw$/i, label: "BeraPaw", icon: getDappLogo("BeraPaw") },
    { reg: /^Dinero$/i, label: "Dinero", icon: getDappLogo("Dinero") },
    { reg: /^Stride$/i, label: "Stride", icon: getDappLogo("Stride") },
    { reg: /^Beradrome$/i, label: "Beradrome", icon: getDappLogo("Beradrome") },
    { reg: /^Smilee$/i, label: "Smilee", icon: getDappLogo("Smilee") },
    { reg: /^Olympus$/i, label: "Olympus", icon: getDappLogo("Olympus") },
    { reg: /^Berapulg$/i, label: "Berapulg", icon: getDappLogo("Berapulg") },
    { reg: /^Yeet$/i, label: "Yeet", icon: getDappLogo("Yeet") },
    { reg: /^Kodiak$/i, label: "Kodiak", icon: getDappLogo("Kodiak") },
    { reg: /^SolvProtocol$/i, label: "SolvProtocol", icon: getDappLogo("SolvProtocol") },
    { reg: /^NAV$/i, label: "NAV", icon: getDappLogo("NAV") },
    { reg: /^Renzo$/i, label: "Renzo", icon: getDappLogo("Renzo") },
    { reg: /^Bedrock$/i, label: "Bedrock", icon: getDappLogo("Bedrock") },
    { reg: /^Holdstation$/i, label: "Holdstation", icon: getDappLogo("Holdstation") },
    { reg: /^Reservoir$/i, label: "Reservoir", icon: getDappLogo("Reservoir") },
    { reg: /^Avalon Labs$/i, label: "Avalon Labs", icon: getDappLogo("Avalon Labs") },
    { reg: /^HPOS10I$/i, label: "HPOS10I", icon: getDappLogo("HPOS10I") },
    { reg: /^Beramonium$/i, label: "Beramonium", icon: getDappLogo("Beramonium") },
    { reg: /^StakeStone$/i, label: "StakeStone", icon: getDappLogo("StakeStone") },
    { reg: /^BM$/i, label: "BM", icon: getDappLogo("BM") },
    { reg: /^Ramen$/i, label: "Ramen", icon: getDappLogo("Ramen") },
    { reg: /^Bulla$/i, label: "Bulla", icon: getDappLogo("Bulla") },
    { reg: /^BurrBear$/i, label: "BurrBear", icon: getDappLogo("BurrBear") },
    { reg: /^WeBera$/i, label: "WeBera", icon: getDappLogo("WeBera") },
    { reg: /^Dolomite$/i, label: "Dolomite", icon: getDappLogo("Dolomite") },
    { reg: /^Memeswap$/i, label: "Memeswap", icon: getDappLogo("Memeswap") },
    { reg: /^Nome$/i, label: "Nome", icon: getDappLogo("Nome") },
  ]
};

export enum PAGINATION_ACTION {
  FIRST = "first",
  PREV = "previous",
  NEXT = "next",
  LAST = "last",
}
