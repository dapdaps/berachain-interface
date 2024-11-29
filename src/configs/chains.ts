import { Chain } from 'viem';
import { mainnet, berachainTestnetbArtio } from '@reown/appkit/networks';

const chains: Record<number, Chain | any> = {
  [berachainTestnetbArtio.id]: {
    ...berachainTestnetbArtio,
    isWalletSupport: true,
  },
  [mainnet.id]: {
    ...mainnet,
    isWalletSupport: true,
  },
};

export const icons: Record<number, string> = {
  80084: '/images/berachain.png',
  1: '/images/eth.svg',
  // 1101: '/images/berachain.png'
};

export default chains;
