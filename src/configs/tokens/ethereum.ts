import type { Token } from '@/types';

const CHAIN_ID = 1;
export const ethereum: { [key: string]: Token } = {
  eth: {
    chainId: CHAIN_ID,
    name: 'ETH',
    symbol: 'ETH',
    icon: '/assets/tokens/eth.png',
    decimals: 18,
    isNative: true,
    address: 'native'
  },
  usdc: {
    chainId: CHAIN_ID,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    name: 'USDC',
    symbol: 'USDC',
    icon: '/assets/tokens/usdc.png',
    decimals: 6
  },
  weth: {
    chainId: CHAIN_ID,
    address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: '/assets/tokens/weth.png'
  },
  usdt: {
    chainId: CHAIN_ID,
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    name: 'Tether USD',
    symbol: 'USDT',
    icon: '/assets/tokens/usdt.png',
    decimals: 6
  },
  usdd: {
    address: '0x0C10bF8FcB7Bf5412187A595ab97a3609160b5c6',
    chainId: CHAIN_ID,
    name: 'Decentralized USD',
    symbol: 'USDD',
    icon: '/assets/tokens/usdd.jpg',
    decimals: 18
  },
  dai: {
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    chainId: CHAIN_ID,
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    icon: '/assets/tokens/dai.png',
    decimals: 18
  },
  frax: {
    address: '0x853d955aCEf822Db058eb8505911ED77F175b99e',
    chainId: CHAIN_ID,
    name: 'Frax',
    symbol: 'FRAX',
    icon: '/assets/tokens/frax.webp',
    decimals: 18
  },
  susd: {
    address: '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',
    chainId: CHAIN_ID,
    name: 'Synth sUSD',
    symbol: 'sUSD',
    icon: '/assets/tokens/susd.webp',
    decimals: 18
  },
  lusd: {
    address: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
    chainId: CHAIN_ID,
    name: 'LUSD Stablecoin',
    symbol: 'LUSD',
    icon: '/assets/tokens/lusd.png',
    decimals: 6
  },
  mai: {
    address: '0x8D6CeBD76f18E1558D4DB88138e2DeFB3909fAD6',
    chainId: CHAIN_ID,
    name: 'Mai Stablecoin',
    symbol: 'MAI',
    icon: '/assets/tokens/mai.png',
    decimals: 18
  },
  ezETH: {
    address: '0xbf5495Efe5DB9ce00f80364C8B423567e58d2110',
    chainId: CHAIN_ID,
    symbol: 'ezETH',
    decimals: 18,
    name: 'ezETH',
    icon: '/assets/tokens/ezeth.svg'
  },
  rsETH: {
    address: '0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7',
    chainId: CHAIN_ID,
    symbol: 'rsETH',
    decimals: 18,
    name: 'rsETH',
    icon: '/assets/tokens/rseth.svg'
  },
  wbtc: {
    chainId: CHAIN_ID,
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    symbol: "WBTC", 
    name: "Wrapped BTC",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/3717.png"
  },
  "pumpBTC.bera": {
    chainId: CHAIN_ID,
    address: "0x1fcca65fb6ae3b2758b9b2b394cb227eae404e1e",
    decimals: 8,
    symbol: "pumpBTC.bera",
    name: "pumpBTC.bera",
    icon: "/assets/tokens/pumpbtc.png"
  },
  fbtc: {
    chainId: CHAIN_ID,
    address: "0xC96dE26018A54D51c097160568752c4E3BD6C364",
    decimals: 8,
    symbol: "FBTC",
    name: "Fire Bitcoin",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/32306.png"
  },
  lbtc: {
    chainId: CHAIN_ID,
    address: "0x8236a87084f8B84306f72007F36F2618A5634494", 
    decimals: 8,
    symbol: "LBTC",
    name: "Lombard Staked Bitcoin",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33652.png"
  },
  // rseth: {
  //   chainId: CHAIN_ID,
  //   address: "0xA1290d69c65A6Fe4DF752f95823fae25cB99e5A7",
  //   decimals: 18,
  //   symbol: "rsETH",
  //   icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/29242.png"
  // },
  rsweth: {
    chainId: CHAIN_ID,
    address: "0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0",
    decimals: 18,
    symbol: "rswETH",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/29974.png"
  },
  rusd: {
    chainId: CHAIN_ID,
    address: "0x09D4214C03D01F49544C0448DBE3A27f768F2b34",
    decimals: 18,
    symbol: "rUSD",
    icon: "/assets/tokens/usdc.png",
    name: "Reservoir Stablecoin"
  },
  solvbtc: {
    chainId: CHAIN_ID,
    address: "0x7A56E1C57C7475CCf742a1832B028F0456652F97",
    decimals: 18,
    symbol: "SolvBTC",
    name: "Solv BTC",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33312.png"
  },
  solvbtcbbn: {
    chainId: CHAIN_ID,
    address: "0xd9D920AA40f578ab794426F5C90F6C731D159DEf",
    decimals: 18,
    symbol: "SolvBTC.BBN",
    name: "SolvBTC Babylon",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33310.png"
  },
  stbtc: {
    chainId: CHAIN_ID,
    address: "0xf6718b2701D4a6498eF77D7c152b2137Ab28b8A3",
    decimals: 18,
    symbol: "stBTC",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33312.png",
    name: "Lorenzo stBTC"
  },
  susda: {
    chainId: CHAIN_ID,
    address: "0x2B66AAdE1e9C062FF411bd47C44E0Ad696d43BD9",
    decimals: 18,
    symbol: "sUSDa",
    name: "USDa saving token",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/35538.png"
  },
  susde: {
    chainId: CHAIN_ID,
    address: "0x9D39A5DE30e57443BfF2A8307A4256c8797A3497",
    decimals: 18,
    symbol: "sUSDe",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/29471.png"
  },
  unibtc: {
    chainId: CHAIN_ID,
    address: "0x004E9C3EF86bc1ca1f0bB5C7662861Ee93350568",
    decimals: 8,
    symbol: "uniBTC",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33312.png",
    name: "uniBTC"
  },
  usda: {
    chainId: CHAIN_ID,
    address: "0x8A60E489004Ca22d775C5F2c657598278d17D9c2",
    decimals: 18,
    symbol: "USDa",
    name: "USDa",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/35368.png"
  },
  usde: {
    chainId: CHAIN_ID,
    address: "0x4c9EDD5852cd905f086C759E8383e09bff1E68B3",
    decimals: 18,
    symbol: "USDe",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/29470.png"
  },
  wabtc: {
    chainId: CHAIN_ID,
    address: "0x09DEF5aBc67e967d54E8233A4b5EBBc1B3fbE34b",
    decimals: 18,
    symbol: "waBTC",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/33312.png",
    name: "Wrapped aBTC"
  },
  weeth: {
    chainId: CHAIN_ID,
    address: "0xCd5fE23C85820F7B72D0926FC9b05b43E359b7ee",
    decimals: 18,
    symbol: "weETH",
    name: "Wrapped eETH",
    icon: "https://s2.coinmarketcap.com/static/img/coins/128x128/28568.png"
  }
};
