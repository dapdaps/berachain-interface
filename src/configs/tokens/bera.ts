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
    icon: "/assets/tokens/ibgt.png",
    color: "rgb(42,17,14)"
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
    icon: "/assets/tokens/uniBTC.webp"
  },
  brbtc: {
    chainId: CHAIN_ID,
    address: "0x93919784c523f39cacaa98ee0a9d96c3f32b593e",
    decimals: 8,
    symbol: "brBTC",
    name: "Bedrock BTC",
    icon: "/assets/tokens/brBTC.webp"
  },
  nect: {
    chainId: CHAIN_ID,
    address: "0x1ce0a25d13ce4d52071ae7e02cf1f6606f4c79d3",
    decimals: 18,
    symbol: "NECT",
    name: "Nectar",
    icon: "/assets/tokens/nectar.png"
  },

  snect: {
    chainId: CHAIN_ID,
    address: "0x597877Ccf65be938BD214C4c46907669e3E62128",
    decimals: 18,
    symbol: "sNECT",
    name: "Staked Nectar",
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
  "rusd ot": {
    chainId: CHAIN_ID,
    address: "0x4a8b5283e053a8b118eadc4981e8ec8659995652",
    decimals: 18,
    symbol: "rUSD OT",
    name: "rUSD OT",
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
    icon: "/assets/tokens/byusd.png",
    color: "rgb(242,180,51)"
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
    icon: "/assets/tokens/ramen.png",
    color: "#d93527"
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
    icon: "/assets/tokens/hold.png",
    color: "#a28cff"
  },

  henlo: {
    chainId: CHAIN_ID,
    address: "0xb2F776e9c1C926C4b2e54182Fac058dA9Af0B6A5",
    decimals: 18,
    symbol: "HENLO",
    name: "HENLO",
    icon: "/assets/tokens/henlo.png",
    color: "rgb(42,88,251)"
  },
  stbgt: {
    chainId: CHAIN_ID,
    address: "0x2cec7f1ac87f5345ced3d6c74bbb61bfae231ffb",
    symbol: "stBGT",
    name: "stBGT",
    decimals: 18,
    icon: "/assets/tokens/stbgt.png",
    color: "rgb(203,48,100)"
  },
  usdbr: {
    chainId: CHAIN_ID,
    address: "0x6d4223dae2a8744a85a6d44e97f3f61679f87ee6",
    symbol: "USDbr",
    name: "USDbr",
    decimals: 18,
    icon: "/assets/tokens/usdbr.webp",
    color: "rgb(211,160,49)"
  },
  ibera: {
    chainId: CHAIN_ID,
    address: "0x9b6761bf2397bb5a6624a856cc84a3a14dcd3fe5",
    symbol: "iBERA",
    name: "Infrared BERA",
    decimals: 18,
    icon: "/assets/tokens/ibera.png",
    color: "rgb(180,71,94)"
  },
  lbgt: {
    chainId: CHAIN_ID,
    address: "0xbaadcc2962417c01af99fb2b7c75706b9bd6babe",
    symbol: "LBGT",
    name: "Liquid BGT",
    decimals: 18,
    icon: "/assets/tokens/lbgt.png",
    isMeme: true,
    color: "rbg(78,179,249)"
  },
  ppaw: {
    chainId: CHAIN_ID,
    address: "0x03c86e21623f25eca0ea544890c7603b9a33e1ac",
    symbol: "pPAW",
    name: "Pre-TGE Paw",
    decimals: 18,
    icon: "/assets/tokens/ppaw.svg"
  },
  nome: {
    chainId: CHAIN_ID,
    address: "0xfaf4c16847bd0ebac546c49a9c9c6b81abd4b08c",
    symbol: "NOME",
    name: "NOME",
    decimals: 18,
    icon: "/assets/tokens/nome.webp",
    color: "rgb(232,193,88)"
  },
  azt: {
    chainId: CHAIN_ID,
    address: "0xdad7898717ade066e1114e6bdbfafd8a6f378b7b",
    symbol: "AZT",
    name: "AZEx Token",
    decimals: 18,
    icon: "/assets/tokens/azt.webp",
    isMeme: true,
    color: "#fff"
  },
  artio: {
    chainId: CHAIN_ID,
    address: "0x6ff4d64976428025cdcc3354ef53b5d19637481e",
    symbol: "ARTIO",
    name: "Artio",
    decimals: 18,
    icon: "/assets/tokens/artio.png",
    isMeme: true,
    color: "rgb(244,193,55)"
  },
  bitcoin: {
    chainId: CHAIN_ID,
    address: "0x6b26f778bfae56cfb4bf9b62c678d9d40e725227",
    symbol: "BITCOIN",
    name: "HarryPotterObamaSonic10Inu",
    decimals: 8,
    icon: "/assets/tokens/bitcoin.webp",
    color: "rgb(0,0,0)"
  },
  ohm: {
    chainId: CHAIN_ID,
    address: "0x18878Df23e2a36f81e820e4b47b4A40576D3159C",
    symbol: "OHM",
    name: "Olympus",
    decimals: 9,
    icon: "/assets/tokens/ohm.webp",
    color: "rgb(117,138,149)"
  },
  wizz: {
    chainId: CHAIN_ID,
    address: "0x01c8a5ccad23a4d3764ef71c403862160aa2913a",
    symbol: "WIZZ",
    name: "Wizzwoods Token",
    decimals: 18,
    icon: "/assets/tokens/wizz.svg",
    color: "rgb(0,0,0)"
  },
  br: {
    chainId: CHAIN_ID,
    address: "0xd352dc6e5f0c45e2f2b38eb5565eb286a1ea4087",
    symbol: "BR",
    name: "Bedrock",
    decimals: 18,
    icon: "/assets/tokens/bedrock.png",
    color: "rgb(0,0,0)"
  },
  pollen: {
    chainId: CHAIN_ID,
    address: "0xc99e948e9d183848a6c4f5e6c1d225f02f171d79",
    symbol: "POLLEN",
    name: "POLLEN",
    decimals: 18,
    icon: "/assets/tokens/pollen.png",
    color: "rgb(0,0,0)"
  },
  beramo: {
    chainId: CHAIN_ID,
    address: "0x1f7210257fa157227d09449229a9266b0d581337",
    symbol: "BERAMO",
    name: "BeramoniumCoin",
    decimals: 18,
    icon: "/assets/tokens/beramo.svg",
    color: "rgb(0,0,0)"
  },
  stlbgt: {
    chainId: CHAIN_ID,
    address: "0xFace73a169e2CA2934036C8Af9f464b5De9eF0ca",
    symbol: "stLBGT",
    name: "stLBGT",
    decimals: 18,
    icon: "/assets/tokens/lbgt.png",
    color: "rgb(0,0,0)"
  },
  sbtc: {
    chainId: CHAIN_ID,
    address: "0x93F4d0ab6a8B4271f4a28Db399b5E30612D21116",
    symbol: "SBTC",
    name: "StakeStone Bitcoin",
    decimals: 18,
    icon: "/assets/tokens/sbtc.png",
    color: "rgb(0,0,0)"
  },
  solvbtcbbnot: {
    chainId: CHAIN_ID,
    address: "0xA01cB564ecc3F58a4e2bA5fD59d13a6b998de9b8",
    symbol: "SolvBTC.BBN-OT",
    name: "SolvBTC.BBN-OT",
    decimals: 18,
    icon: "/assets/tokens/default_icon.png",
    color: "rgb(0,0,0)"
  },
  rsethot: {
    chainId: CHAIN_ID,
    address: "0xB1195a6cdB7ef8fB22671bd8321727dBB6DDDe03",
    symbol: "rsETH-OT",
    name: "rsETH-OT",
    decimals: 18,
    icon: "/assets/tokens/default_icon.png",
    color: "rgb(0,0,0)"
  },
  unibtcot: {
    chainId: CHAIN_ID,
    address: "0xE771779B350d2cC291E9461387d7f41765a7cB8b",
    symbol: "uniBTC-OT",
    name: "uniBTC-OT",
    decimals: 18,
    icon: "/assets/tokens/default_icon.png",
    color: "rgb(0,0,0)"
  },
  ylpumpbtc: {
    chainId: CHAIN_ID,
    address: "0xdCB3D91555385DaE23e6B966b5626aa7A75Be940",
    symbol: "ylpumpBTC",
    name: "CIAN yield layer pumpBTC",
    decimals: 8,
    icon: "/assets/tokens/ylpumpbtc.png",
    color: "rgb(0,0,0)"
  },
  ylsteth: {
    chainId: CHAIN_ID,
    address: "0xa958090601E21A82e9873042652e35891D945a8C",
    symbol: "ylstETH",
    name: "CIAN yield layer stETH",
    decimals: 18,
    icon: "/assets/tokens/ylsteth.png",
    color: "rgb(0,0,0)"
  },
  ylfbtc: {
    chainId: CHAIN_ID,
    address: "0xE946Dd7d03F6F5C440F68c84808Ca88d26475FC5",
    symbol: "ylfBTC",
    name: "CIAN yield layer fBTC",
    decimals: 8,
    icon: "/assets/tokens/ylbtclst.png",
    color: "rgb(0,0,0)"
  },
  ylrseth: {
    chainId: CHAIN_ID,
    address: "0x9B2316cfe980515de7430F1c4E831B89a5921137",
    symbol: "ylrsETH",
    name: "CIAN yield layer rsETH",
    decimals: 18,
    icon: "/assets/tokens/ylrseth.png",
    color: "rgb(0,0,0)"
  },
  wgbera: {
    chainId: CHAIN_ID,
    address: "0xD77552D3849ab4D8C3b189A9582d0ba4C1F4f912",
    symbol: "wgBERA",
    name: "Wrapped gBERA",
    decimals: 18,
    icon: "/assets/tokens/wgbera.png",
    color: "rgb(0,0,0)"
  },
  burr: {
    chainId: CHAIN_ID,
    address: "0x28e0e3b9817012b356119df9e217c25932d609c2",
    symbol: "BURR",
    name: "Burr Governance Token",
    decimals: 18,
    icon: "/assets/tokens/burr.png",
    color: "rgb(0,0,0)"
  },
  plug: {
    chainId: CHAIN_ID,
    address: "0x231a6bd8eb88cfa42776b7ac575cecaf82bf1e21",
    symbol: "PLUG",
    name: "Beraplug",
    decimals: 18,
    icon: "/assets/tokens/plug.webp",
    color: "rgb(0,0,0)"
  },
  bread: {
    chainId: CHAIN_ID,
    address: "0x0003eedfdd020bf60d10cf684abac7c4534b7ead",
    symbol: "BREAD",
    name: "Bread",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },
  dolomite: {
    chainId: CHAIN_ID,
    address: "0x0f81001ef0a83ecce5ccebf63eb302c70a39a654",
    symbol: "DOLO",
    name: "Dolomite",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },
  ybgt: {
    chainId: CHAIN_ID,
    address: "0x7e768f47dfdd5dae874aac233f1bc5817137e453",
    symbol: "yBGT",
    name: "Bearn BGT",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },
  osbgt: {
    chainId: CHAIN_ID,
    address: "0xd2c41bf4033a83c0fc3a7f58a392bf37d6dcdb58",
    symbol: "osBGT",
    name: "OpenState BGT",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },
  nav: {
    chainId: CHAIN_ID,
    address: "0x6536cead649249cae42fc9bfb1f999429b3ec755",
    symbol: "NAV",
    name: "NavFinance",
    decimals: 18,
    icon: "/assets/tokens/nav.png",
    color: "rgb(0,0,0)"
  },
  prg: {
    chainId: CHAIN_ID,
    address: "0xbf2e152f460090ace91a456e3dee5acf703f27ad",
    symbol: "PRG",
    name: "Porridge",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },

  ooga: {
    chainId: CHAIN_ID,
    address: "0x009af46df68db0e76bfe9ea35663f6ed17877956",
    symbol: "OOGA",
    name: "Ooga Token",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },
  bixbt: {
    chainId: CHAIN_ID,
    address: "0x147c9a7f5265d7ca9a671c3817b212a0cf88856e",
    symbol: "BIXBT",
    name: "BeraXBT",
    decimals: 18,
    icon: "/assets/tokens/bixbt.webp",
    color: "rgb(0,0,0)"
  },
  qia: {
    chainId: CHAIN_ID,
    address: "0x41fc191d145307667ea3e50f244b78de9cddf53f",
    symbol: "QIA",
    name: "Quod In Altum",
    decimals: 18,
    icon: "",
    color: "rgb(0,0,0)"
  },

};
