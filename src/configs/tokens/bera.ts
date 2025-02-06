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
    address: "0x2F6F07CDcf3588944Bf4C42aC74ff24bF56e7590",
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
    address: "0xFCBD14DC51f0A4d49d5E53C2E0950e0bC26d0Dce",
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
  usdt: {
    chainId: CHAIN_ID,
    address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    decimals: 6,
    symbol: "USDT",
    name: "Tether USD",
    icon: "/assets/tokens/usdt.png",
    color: "#059393"
  }
};
