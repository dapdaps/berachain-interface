import { Chain } from 'viem';
import { mainnet, berachainTestnetbArtio, arbitrum, sepolia } from '@reown/appkit/networks';

const chains: Record<number, Chain | any> = {
  [berachainTestnetbArtio.id]: {
    ...berachainTestnetbArtio,
    rpcUrls: {
      default: { http: ['https://bartio.drpc.org', 'https://bartio.rpc.berachain.com'] },
    },
    isWalletSupport: true,
  },
  // 需要支持eth测试链
  [sepolia.id]: {
    ...sepolia,
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
  11_155_111: '/images/eth.svg',
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
    rpcUrls: {
      default: { http: ['https://bartio.drpc.org', 'https://bartio.rpc.berachain.com'] },
    },
  },
};
