import { Chain } from 'viem';
import { mainnet, berachainTestnetbArtio, arbitrum,  } from '@reown/appkit/networks';

const chains: Record<number, Chain | any> = {
  [berachainTestnetbArtio.id]: {
    ...berachainTestnetbArtio,
    isWalletSupport: true,
  },
  [mainnet.id]: {
    ...mainnet,
    isWalletSupport: false,
  },
};

export const icons: Record<number, string> = {
  80084: '/images/berachain.png',
  1: '/images/eth.svg',
  // 1101: '/images/berachain.png'
};

export default chains;

export const ChristmasActivityChains: Record<number, Chain | any> = {
  [arbitrum.id]: {
    ...arbitrum,
  },
  [mainnet.id]: {
    ...mainnet,
  },
  [berachainTestnetbArtio.id]: {
    ...berachainTestnetbArtio,
  },
};
