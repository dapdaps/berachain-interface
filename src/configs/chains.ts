import { Chain } from 'viem';
import { mainnet, polygonZkEvm } from 'viem/chains';

const chains: Record<number, Chain | any> = {
  80084: {
    id: 80084,
    name: 'Berachain bArtio',
    icon: '',
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
  1: 'https://app.dapdap.net/assets/images/bafkreicjsbkvvcxahxjejkctwopcnmzbeskxhfrkg7lyawhkhzrxcmvgfy.svg',
  1101: 'https://s3.amazonaws.com/dapdap.main/images/polygon-zkevm-chainicon.png'
};

export default chains;
