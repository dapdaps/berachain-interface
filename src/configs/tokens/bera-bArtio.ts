import type { Token } from '@/types';

const CHAIN_ID = 80084;

export const beraB: { [key: string]: Token } = {
  bera: {
    address: 'native',
    isNative: true,
    chainId: CHAIN_ID,
    symbol: 'BERA',
    decimals: 18,
    name: 'BERA',
    icon: '/assets/tokens/bera.svg',
    color: '#78350F'
  },
  wbera: {
    address: '0x7507c1dc16935B82698e4C63f2746A2fCf994dF8',
    chainId: CHAIN_ID,
    symbol: 'WBERA',
    decimals: 18,
    name: 'WBERA',
    icon: '/assets/tokens/wbera.svg',
    color: '#f5f5f4'
  },
  honey: {
    address: '0x0E4aaF1351de4c0264C5c7056Ef3777b41BD8e03',
    chainId: CHAIN_ID,
    symbol: 'HONEY',
    decimals: 18,
    name: 'HONEY',
    icon: '/images/dapps/honey.png',
    color: '#d97706'
  },
  usdt: {
    chainId: CHAIN_ID,
    address: '0x05D0dD5135E3eF3aDE32a9eF9Cb06e8D37A6795D',
    decimals: 6,
    symbol: 'USDT',
    name: 'Tether USD',
    icon: '/assets/tokens/usdt.png',
    color: '#059393'
  },
  usdc: {
    chainId: CHAIN_ID,
    address: '0xd6D83aF58a19Cd14eF3CF6fe848C9A4d21e5727c',
    decimals: 6,
    symbol: 'USDC',
    name: 'USD Coin',
    icon: '/assets/tokens/usdc.png',
    color: '#2775CA'
  },
  dai: {
    chainId: CHAIN_ID,
    address: '0x806Ef538b228844c73E8E692ADCFa8Eb2fCF729c',
    decimals: 18,
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    icon: '/assets/tokens/dai.png',
    color: '#fbba34'
  },
  wbtc: {
    chainId: CHAIN_ID,
    address: '0x2577D24a26f8FA19c1058a8b0106E2c7303454a4',
    decimals: 8,
    symbol: 'WBTC',
    name: 'Wrapped BTC',
    icon: '/assets/tokens/wbtc.png',
    color: '#F7931A'
  },
  weth: {
    chainId: CHAIN_ID,
    address: '0xE28AfD8c634946833e89ee3F122C06d7C537E8A8',
    decimals: 18,
    symbol: 'WETH',
    name: 'Wrapped Ether',
    icon: '/assets/tokens/weth.png',
    color: '#D2D2D2'
  },
  eth: {
    chainId: CHAIN_ID,
    address: '0x6e1e9896e93f7a71ecb33d4386b49deed67a231a',
    decimals: 18,
    symbol: 'ETH',
    name: 'Ethereum',
    icon: '/assets/tokens/eth.png',
    color: '#5b7ff2'
  },
  mimg: {
    chainId: CHAIN_ID,
    address: '0x43Eb9f03c5B5C7963B24652BcE396A65F75F16aB',
    decimals: 18,
    symbol: 'MIMG',
    name: 'MIMG',
    icon: '/assets/tokens/mimg.svg',
    color: '#FFDD02'
  }
};
