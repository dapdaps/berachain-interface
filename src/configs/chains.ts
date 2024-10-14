import { Chain } from 'viem';
import { mainnet, polygonZkEvm } from 'viem/chains';

const chains: Record<number, Chain | any> = {
  80084: {
    id: 80084,
    name: 'Berachain bArtio',
    icon: '/images/berachain.png',
    nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://bartio.rpc.berachain.com/']
      }
    },
    blockExplorers: {
      default: {
        name: 'beratrail',
        url: 'https://bartio.beratrail.io'
      }
    }
  },
  [mainnet.id]: mainnet,
  [polygonZkEvm.id]: polygonZkEvm
};

export const icons: Record<number, string> = {
  80084: '/images/berachain.png',
  1: '/images/eth.svg',
  // 1101: '/images/berachain.png'
};

export default chains;
