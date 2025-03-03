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
  ebtc: {
    chainId: CHAIN_ID,
    address: "0x657e8c867d8b37dcc18fa4caead9c45eb088c642",
    decimals: 8,
    symbol: "eBTC",
    name: "Ether.Fi BTC",
    icon: "/assets/tokens/ebtc.svg",
    color: "#F7931A"
  },
  usdt0: {
    chainId: CHAIN_ID,
    address: "0x779Ded0c9e1022225f8E0630b35a9b54bE713736",
    decimals: 6,
    symbol: "USD₮0",
    name: "USD₮0",
    icon: "/assets/tokens/usdt0.png",
    color: "#059393",
    priceKey: "USDT0"
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
  },
  bonga: {
    chainId: CHAIN_ID,
    address: "0x11909A68AE60903c96C35C059fcf262e54Df29d5",
    decimals: 18,
    symbol: "BONGA",
    name: "Bong Bears",
    icon: "/assets/tokens/bonga.png",
    isMeme: true
  },
  byusd: {
    chainId: CHAIN_ID,
    address: "0x688e72142674041f8f6af4c808a4045ca1d6ac82",
    decimals: 6,
    symbol: "BYUSD",
    name: "BYUSD",
    icon: "/assets/tokens/byusd.png"
  },
  fbtc: {
    chainId: CHAIN_ID,
    address: "0xbAC93A69c62a1518136FF840B788Ba715cbDfE2B",
    decimals: 8,
    symbol: "FBTC",
    name: "Fire Bitcoin",
    icon: "/assets/tokens/fbtc.png"
  },
  lbtc: {
    chainId: CHAIN_ID,
    address: "0xecAc9C5F704e954931349Da37F60E39f515c11c1",
    decimals: 8,
    symbol: "LBTC",
    name: "Lombard Staked Bitcoin",
    icon: "/assets/tokens/lbtc.png"
  },
  rseth: {
    chainId: CHAIN_ID,
    address: "0x4186BFC76E2E237523CBC30FD220FE055156b41F",
    decimals: 18,
    symbol: "rsETH",
    icon: "/assets/tokens/rseth.svg"
  },
  rsweth: {
    chainId: CHAIN_ID,
    address: "0x850CDF416668210ED0c36bfFF5d21921C7adA3b8",
    decimals: 18,
    symbol: "rswETH",
    icon: "/assets/tokens/rsweth.png"
  },
  solvbtc: {
    chainId: CHAIN_ID,
    address: "0x541FD749419CA806a8bc7da8ac23D346f2dF8B77",
    decimals: 18,
    symbol: "SolvBTC",
    name: "Solv BTC",
    icon: "/assets/tokens/solvbtc.png"
  },
  solvbtcbbn: {
    chainId: CHAIN_ID,
    address: "0xCC0966D8418d412c599A6421b760a847eB169A8c",
    decimals: 18,
    symbol: "SolvBTC.BBN",
    name: "SolvBTC Babylon",
    icon: "/assets/tokens/solv-btc.bbn.webp"
  },
  stbtc: {
    chainId: CHAIN_ID,
    address: "0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3",
    decimals: 18,
    symbol: "stBTC",
    icon: "/assets/tokens/stbtc.png",
    name: "Lorenzo stBTC"
  },
  susda: {
    chainId: CHAIN_ID,
    address: "0x2840F9d9f96321435Ab0f977E7FDBf32EA8b304f",
    decimals: 18,
    symbol: "sUSDa",
    name: "USDa saving token",
    icon: "/assets/tokens/susda.png"
  },
  susde: {
    chainId: CHAIN_ID,
    address: "0x211Cc4DD073734dA055fbF44a2b4667d5E5fE5d2",
    decimals: 18,
    symbol: "sUSDe",
    name: "Staked USDe",
    icon: "/assets/tokens/sUSDe.svg"
  },
  wabtc: {
    chainId: CHAIN_ID,
    address: "0x09DEF5aBc67e967d54E8233A4b5EBBc1B3fbE34b",
    decimals: 18,
    symbol: "waBTC",
    icon: "/assets/tokens/wabtc.png",
    name: "Wrapped aBTC"
  },
  weeth: {
    chainId: CHAIN_ID,
    address: "0x7DCC39B4d1C53CB31e1aBc0e358b43987FEF80f7",
    decimals: 18,
    symbol: "weETH",
    icon: "/assets/tokens/weeth.png"
  },
  yeet: {
    chainId: CHAIN_ID,
    address: "0x08a38caa631de329ff2dad1656ce789f31af3142",
    decimals: 18,
    symbol: "YEET",
    name: "YEET",
    icon: "/assets/tokens/YEET.png",
    isMeme: true
  },
  ramen: {
    chainId: CHAIN_ID,
    address: "0xb8B1Af593Dc37B33a2c87C8Db1c9051FC32858B7",
    decimals: 18,
    symbol: "RAMEN",
    name: "RAMEN",
    icon: "/assets/tokens/ramen.png"
  },
  bblast: {
    chainId: CHAIN_ID,
    address: "0x6BAd2A58927198F8D39A90625699c2A3c9bDd4ce",
    decimals: 18,
    symbol: "BBLAST",
    name: "Bera Blast",
    icon: "/assets/tokens/bblast.png",
    isMeme: true
  },
  stone: {
    chainId: CHAIN_ID,
    address: "0xEc901DA9c68E90798BbBb74c11406A32A70652C3",
    decimals: 18,
    symbol: "STONE",
    name: "StakeStone Ether",
    icon: "/assets/tokens/stone.png"
  },
  godl: {
    chainId: CHAIN_ID,
    address: "0x85468a0CB26B5Fc1F2B7B7BA3aee07F073dff709",
    decimals: 18,
    symbol: "GODL",
    icon: "https://ichi-images.s3.us-east-1.amazonaws.com/tokens/logo_256_godl.svg"
  },

  bm: {
    chainId: CHAIN_ID,
    address: "0xb749584F9fC418Cf905d54f462fdbFdC7462011b",
    decimals: 18,
    symbol: "bm",
    name: "bm",
    icon: "/assets/tokens/bm.png"
  },
  hold: {
    chainId: CHAIN_ID,
    address: "0xff0a636dfc44bb0129b631cdd38d21b613290c98",
    decimals: 18,
    symbol: "HOLD",
    name: "HOLD",
    icon: "/assets/tokens/hold.png"
  }
};
