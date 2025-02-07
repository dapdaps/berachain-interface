import type { Token } from "@/types";

const CHAIN_ID = 80094;

export const bera: { [key: string]: Token } = {
  bera: {
    address: "native",
    isNative: true,
    chainId: CHAIN_ID,
    symbol: "BERA",
    decimals: 18,
    name: "BERA",
    icon: "/assets/tokens/bera.svg",
    color: "#78350F"
  },
  wbera: {
    address: "0x6969696969696969696969696969696969696969",
    chainId: CHAIN_ID,
    symbol: "WBERA",
    decimals: 18,
    name: "WBERA",
    icon: "/assets/tokens/wbera.png",
    color: "#f5f5f4"
  },
  weth: {
    chainId: CHAIN_ID,
    address: "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
    decimals: 18,
    symbol: "WETH",
    name: "Wrapped Ether",
    icon: "/assets/tokens/weth.png",
    color: "#D2D2D2"
  },
  "usdc.e": {
    chainId: CHAIN_ID,
    address: "0x549943e04f40284185054145c6E4e9568C1D3241",
    decimals: 6,
    symbol: "USDC.e",
    name: "USDC.e",
    icon: "/assets/tokens/usdc.png",
    color: "#2775CA"
  },
  honey: {
    address: "0xfcbd14dc51f0a4d49d5e53c2e0950e0bc26d0dce",
    chainId: CHAIN_ID,
    symbol: "HONEY",
    decimals: 18,
    name: "HONEY",
    icon: "/assets/tokens/honey.svg",
    color: "#d97706"
  },
  wbtc: {
    chainId: CHAIN_ID,
    address: "0x0555E30da8f98308EdB960aa94C0Db47230d2B9c",
    decimals: 8,
    symbol: "WBTC",
    name: "Wrapped BTC",
    icon: "/assets/tokens/wbtc.png",
    color: "#F7931A"
  },
  usdt0: {
    chainId: CHAIN_ID,
    address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    decimals: 6,
    symbol: "USD₮0",
    name: "USD₮0",
    icon: "/assets/tokens/usdt0.png",
    color: "#059393"
  },
  ibgt: {
    chainId: CHAIN_ID,
    address: "0xac03CABA51e17c86c921E1f6CBFBdC91F8BB2E6b",
    decimals: 18,
    symbol: "iBGT",
    name: "Infrared BGT",
    icon: "/assets/tokens/ibgt.png"
  },
  mim: {
    chainId: CHAIN_ID,
    address: "0x5B82028cfc477C4E7ddA7FF33d59A23FA7Be002a",
    decimals: 18,
    symbol: "MIM",
    name: "Magic Internet Money",
    icon: "/assets/tokens/mim.png"
  },
  "pumpBTC.bera": {
    chainId: CHAIN_ID,
    address: "0x1fcca65fb6ae3b2758b9b2b394cb227eae404e1e",
    decimals: 8,
    symbol: "pumpBTC.bera",
    name: "pumpBTC.bera",
    icon: "/assets/tokens/pumpbtc.png"
  },
  unibtc: {
    chainId: CHAIN_ID,
    address: "0xc3827a4bc8224ee2d116637023b124ced6db6e90",
    decimals: 8,
    symbol: "uniBTC",
    name: "uniBTC",
    icon: "/assets/tokens/uni-btc.png"
  },
  nect: {
    chainId: CHAIN_ID,
    address: "0x1ce0a25d13ce4d52071ae7e02cf1f6606f4c79d3",
    decimals: 18,
    symbol: "NECT",
    name: "Nectar",
    icon: "/assets/tokens/nectar.png"
  },
  usde: {
    chainId: CHAIN_ID,
    address: "0x5d3a1Ff2b6BAb83b63cd9AD0787074081a52ef34",
    decimals: 18,
    symbol: "USDe",
    name: "USDe",
    icon: "/assets/tokens/usde.png"
  },
  rusd: {
    chainId: CHAIN_ID,
    address: "0x09d4214c03d01f49544c0448dbe3a27f768f2b34",
    decimals: 18,
    symbol: "rUSD",
    name: "Reservoir Stablecoin",
    icon: "/assets/tokens/rusd.png"
  },
  beraeth: {
    chainId: CHAIN_ID,
    address: "0x6fc6545d5cde268d5c7f1e476d444f39c995120d",
    decimals: 18,
    symbol: "beraETH",
    name: "Berachain Staked ETH",
    icon: "/assets/tokens/beraeth.png"
  },
  usda: {
    chainId: CHAIN_ID,
    address: "0xff12470a969dd362eb6595ffb44c82c959fe9acc",
    decimals: 18,
    symbol: "USDa",
    name: "USDa",
    icon: "/assets/tokens/susda.png"
  }
};
