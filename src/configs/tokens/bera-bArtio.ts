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
    icon: '/assets/tokens/wbera.png',
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
    symbol: 'STGUSDC',
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
  red: {
    chainId: CHAIN_ID,
    address: '0x02e68D9037544345161BBFD316B64A1cf3cc5028',
    decimals: 18,
    symbol: 'RED',
    name: 'Pure Red',
    icon: '/assets/tokens/red.png',
    color: '#F00'
  },
  unibtc: {
    chainId: CHAIN_ID,
    address: '0x16221cad160b441db008ef6da2d3d89a32a05859',
    decimals: 8,
    symbol: 'uniBTC',
    name: 'Ethereum',
    icon: '/assets/tokens/uni-btc.png'
  },
  spepe: {
    chainId: CHAIN_ID,
    address: '0xBf1AdF7b28a910F930677d5ccd0637DD1b52e4f0',
    decimals: 18,
    symbol: 'sPepe',
    name: 'Sad Pepe',
    icon: '/assets/tokens/spepe.png',
    isMeme: true
  },
  yeet: {
    chainId: CHAIN_ID,
    address: '0x1740F679325ef3686B2f574e392007A92e4BeD41',
    decimals: 18,
    symbol: 'YEET',
    name: 'YEET',
    icon: '/assets/tokens/YEET.png',
    isMeme: true
  },
  bebe: {
    chainId: CHAIN_ID,
    address: '0xd9591d96D494686729225F7c2B484Cd18B5Bea8b',
    decimals: 18,
    symbol: 'BEBE',
    name: 'BEBE',
    icon: '/assets/tokens/BEBE.png',
    isMeme: true
  },
  sproto: {
    chainId: CHAIN_ID,
    address: '0x46a830DFFdC0eb9BF447CEcDF303F83948303078',
    decimals: 18,
    symbol: 'SPROTO',
    name: 'SPROTO',
    icon: '/assets/tokens/SPROTO.png',
    isMeme: true
  },
  smonkey: {
    chainId: CHAIN_ID,
    address: '0xaAe16A7F9779977444E2b33b75Df1c7E5e3a785d',
    decimals: 18,
    symbol: 'SMONKEY',
    name: 'SMONKEY',
    icon: '/assets/tokens/SMONKEY.png',
    isMeme: true
  },
  pumpbtc: {
    chainId: CHAIN_ID,
    address: '0xe1f167cde04d5d0f8d096957b3a23a7005618976',
    decimals: 18,
    symbol: 'mPumpBTC',
    name: 'mPumpBTC',
    icon: '/assets/tokens/pumpbtc.png'
  },
  mim: {
    chainId: CHAIN_ID,
    address: '0x08b918dd18e087893bb9d711d9e0bbaa7a63ef63',
    decimals: 18,
    symbol: 'MIM',
    name: 'Magic Internet Money',
    icon: '/assets/tokens/mim.png'
  },
  ibgt: {
    chainId: CHAIN_ID,
    address: '0x46eFC86F0D7455F135CC9df501673739d513E982',
    decimals: 18,
    symbol: 'iBGT',
    name: 'Infrared BGT',
    icon: '/assets/tokens/ibgt.png'
  },
  dirac: {
    chainId: CHAIN_ID,
    address: '0x277aaDBd9ea3dB8Fe9eA40eA6E09F6203724BdaE',
    decimals: 18,
    symbol: 'DIRAC',
    name: 'Dirac Finance',
    icon: '/assets/tokens/dirac.png'
  },
  mead: {
    chainId: CHAIN_ID,
    address: '0xf042c01ee84b73c1ba72957bfb54929393b6410d',
    decimals: 18,
    symbol: 'MEAD',
    name: 'Roots Stable',
    icon: '/assets/tokens/mead.png'
  },
  nect: {
    chainId: CHAIN_ID,
    address: '0xf5afcf50006944d17226978e594d4d25f4f92b40',
    decimals: 18,
    symbol: 'MEAD',
    name: 'Nectar',
    icon: '/assets/tokens/nectar.png'
  },
  obero: {
    chainId: CHAIN_ID,
    address: '0x7629668774f918c00Eb4b03AdF5C4e2E53d45f0b',
    decimals: 18,
    symbol: 'oBERO',
    name: 'Beradrome Call Option',
    icon: '/assets/tokens/obero.png'
  },
  croc: {
    chainId: CHAIN_ID,
    address: '0x7237Bd0b21B74fc22d04dc776a06C46202b4dAA1',
    decimals: 18,
    symbol: 'croc',
    name: 'pepewifcroc',
    icon: '/assets/tokens/croc.png'
  },
  std: {
    chainId: CHAIN_ID,
    address: '0xB52a6f70D7c438b9362E693111291ac0FA867298',
    decimals: 18,
    symbol: 'STD',
    name: 'Steady Pemby',
    icon: '/assets/tokens/std.png'
  },
  tedd: {
    chainId: CHAIN_ID,
    address: '0x11eADe385347cC5849f93a350105b38AfB867078',
    decimals: 18,
    symbol: 'TEDD',
    name: 'TEDD',
    icon: '/assets/tokens/tedd.png'
  },
  ooga: {
    chainId: CHAIN_ID,
    address: '0x6173a8C873C7aA8698d2CbEE68A70F54a4061182',
    decimals: 18,
    symbol: 'OOGA',
    name: 'Eat shit Kevin',
    icon: '/assets/tokens/ooga.png'
  },
  '0x15p': {
    chainId: CHAIN_ID,
    address: '0x1179e477F4Dd3D3A69D157D71AB9984177720F6c',
    decimals: 18,
    symbol: '0X15P',
    name: 'TOX1C_0X15P',
    icon: '/assets/tokens/t0x1c_0x15p.png'
  },
  paw: {
    chainId: CHAIN_ID,
    address: '0xB43fd1dC4f02d81f962E98203b2cc4FD9E342964',
    decimals: 18,
    symbol: 'PAW',
    name: 'Paw Token',
    icon: '/assets/tokens/paw.webp'
  }
};
