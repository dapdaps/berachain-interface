import type { Token } from '@/types';

const CHAIN_ID = 169;
export const manta: { [key: string]: Token } = {
  eth: {
    address: 'native',
    isNative: true,
    chainId: CHAIN_ID,
    symbol: 'ETH',
    decimals: 18,
    name: 'Ether',
    icon: '/assets/tokens/eth.png'
  },
  weth: {
    address: '0x0Dc808adcE2099A9F62AA87D9670745AbA741746',
    chainId: CHAIN_ID,
    symbol: 'WETH',
    decimals: 18,
    name: 'Wrapped Ether',
    icon: '/assets/tokens/weth.png'
  },
  // usdc: {
  //   address: '0xb73603C5d87fA094B7314C74ACE2e64D165016fb',
  //   chainId: CHAIN_ID,
  //   symbol: 'USDC',
  //   decimals: 6,
  //   name: 'USD Coin',
  //   icon: '/assets/tokens/usdc.png'
  // },
  usdc: {
    address: '0x09Bc4E0D864854c6aFB6eB9A9cdF58aC190D0dF9',
    chainId: CHAIN_ID,
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
    icon: '/assets/tokens/usdc.png'
  },
  usdt: {
    address: '0xf417F5A458eC102B90352F697D6e2Ac3A3d2851f',
    chainId: CHAIN_ID,
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
    icon: '/assets/tokens/usdt.png'
  },

  wbtc: {
    address: '0x305E88d809c9DC03179554BFbf85Ac05Ce8F18d6',
    chainId: CHAIN_ID,
    symbol: 'WBTC',
    decimals: 8,
    name: 'Wrapped BTC',
    icon: '/assets/tokens/wbtc.png'
  },

  dai: {
    address: '0x1c466b9371f8aBA0D7c458bE10a62192Fcb8Aa71',
    chainId: CHAIN_ID,
    symbol: 'DAI',
    decimals: 18,
    name: 'Dai Stablecoin',
    icon: '/assets/tokens/dai.png'
  },
  matic: {
    chainId: CHAIN_ID,
    name: 'MATIC',
    symbol: 'MATIC',
    icon: '/assets/tokens/matic.webp',
    decimals: 18,
    address: '0x0f52A51287f9b3894d73Df05164D0Ee2533ccBB4'
  },
  quick: {
    chainId: CHAIN_ID,
    name: 'QuickSwap',
    symbol: 'QUICK',
    icon: '/assets/tokens/quick.png',
    decimals: 18,
    address: '0xE22E3D44Ea9Fb0A87Ea3F7a8f41D869C677f0020'
  },
  wsteth: {
    chainId: CHAIN_ID,
    name: 'Wrapped liquid staked Ether 2.0',
    symbol: 'wstETH',
    icon: '/assets/tokens/wsteth.png',
    decimals: 18,
    address: '0x2FE3AD97a60EB7c79A976FC18Bb5fFD07Dd94BA5'
  },
  wusdm: {
    chainId: CHAIN_ID,
    name: 'Wrapped Mountain Protocol USD',
    symbol: 'wUSDM',
    icon: '/assets/tokens/wusdm.webp',
    decimals: 18,
    address: '0xbdAd407F77f44F7Da6684B416b1951ECa461FB07'
  },
  stone: {
    chainId: CHAIN_ID,
    name: 'StakeStone Ether',
    symbol: 'STONE',
    icon: '/assets/tokens/stone.png',
    decimals: 18,
    address: '0xec901da9c68e90798bbbb74c11406a32a70652c3'
  },
  tia: {
    chainId: CHAIN_ID,
    name: 'TIA',
    symbol: 'TIA',
    icon: '/assets/tokens/tia.svg',
    decimals: 6,
    address: '0x6fae4d9935e2fcb11fc79a64e917fb2bf14dafaa'
  },
  izi: {
    chainId: CHAIN_ID,
    name: 'iZUMi Token',
    symbol: 'iZi',
    icon: '/assets/tokens/izi.png',
    decimals: 18,
    address: '0x91647632245caBf3d66121F86C387aE0ad295F9A'
  },
  iusd: {
    chainId: CHAIN_ID,
    address: '0x078f712f038a95beea94f036cadb49188a90604b',
    decimals: 18,
    symbol: 'iUSD',
    name: 'iZUMi Bond USD',
    icon: '/assets/tokens/iusd.svg'
  },
  lab: {
    chainId: CHAIN_ID,
    address: '0x20A512dbdC0D006f46E6cA11329034Eb3d18c997',
    decimals: 18,
    symbol: 'LAB.m',
    name: 'LayerBank Token',
    icon: '/assets/tokens/lab.svg'
  },

  manta: {
    chainId: CHAIN_ID,
    address: '0x95CeF13441Be50d20cA4558CC0a27B601aC544E5',
    decimals: 18,
    symbol: 'MANTA',
    name: 'Manta',
    icon: '/assets/tokens/manta.svg'
  },
  mbtc: {
    address: '0x1468177dbcb2a772f3d182d2f1358d442b553089',
    chainId: CHAIN_ID,
    symbol: 'mBTC',
    decimals: 18,
    name: 'mBTC',
    icon: '/assets/tokens/mbtc.webp'
  },
  vmanta: {
    address: '0x7746ef546d562b443AE4B4145541a3b1a3D75717',
    chainId: CHAIN_ID,
    symbol: 'vMANTA',
    decimals: 18,
    name: 'Bifrost Voucher MANTA',
    icon: '/assets/tokens/vmanta.webp'
  },
  meth: {
    chainId: CHAIN_ID,
    address: '0xACCBC418a994a27a75644d8d591afC22FaBA594e',
    name: 'mETH',
    symbol: 'mETH',
    icon: '/assets/tokens/meth.png',
    decimals: 18
  },
  mUSD: {
    address: '0x649d4524897cE85A864DC2a2D5A11Adb3044f44a',
    chainId: CHAIN_ID,
    symbol: 'mUSD',
    decimals: 18,
    name: 'mUSD',
    icon: '/assets/tokens/mUSD.webp'
  },
  gai: {
    address: '0xcd91716ef98798A85E79048B78287B13ae6b99b2',
    chainId: CHAIN_ID,
    symbol: 'GAI',
    decimals: 18,
    name: 'GAI Stablecoin',
    icon: '/assets/tokens/gai.webp'
  },
  pape: {
    address: '0x6dF00b1e98418cef1f22F5d3300E974969fB6EDb',
    chainId: CHAIN_ID,
    symbol: 'PAPE',
    decimals: 18,
    name: 'Pacific Pepe',
    icon: '/assets/tokens/default_icon.png'
  },
  'manta-ray': {
    address: '0x627bdD923411D9B28B3BC18b48b0a112d443E2bA',
    chainId: CHAIN_ID,
    symbol: 'MantaRay',
    decimals: 18,
    name: 'MantaRay',
    icon: '/assets/tokens/default_icon.png'
  },
  kuma: {
    address: '0xca24fdce9d4d9bd69c829689baea02e34d025f43',
    chainId: CHAIN_ID,
    symbol: 'KUMA',
    decimals: 18,
    name: 'KUMA',
    icon: '/assets/tokens/kuma.png'
  },
  mante: {
    address: '0xaa902c15676c076ec0e7cb7cc57201d2162e2eb6',
    chainId: CHAIN_ID,
    symbol: 'MANTE',
    decimals: 18,
    name: 'MANTE',
    icon: '/assets/tokens/mante.png'
  },
  webmi: {
    address: '0x19585009ce333efcc4a383c28b27a0eb2e8497ea',
    chainId: CHAIN_ID,
    symbol: 'WEBMI',
    decimals: 18,
    name: 'Webmi Token',
    icon: '/assets/tokens/webmi.png'
  },
  mnu: {
    address: '0x0d613b80f9afb3cef99fe26702227d74b0178740',
    chainId: CHAIN_ID,
    symbol: 'MNU',
    decimals: 18,
    name: 'MINUtheManta',
    icon: '/assets/tokens/mnu.png'
  },
  reth: {
    chainId: CHAIN_ID,
    address: '0x6e9655611b42c10b9af25b6ca08be349df45c370',
    decimals: 18,
    symbol: 'rETH',
    name: 'Rocket Pool ETH',
    icon: '/assets/tokens/reth.png'
  }
};
