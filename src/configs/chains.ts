import { Chain } from 'viem';

const chains: Record<number, Chain | any> = {
  80084: {
    id: 80084,
    name: 'Berachain bArtio',
    icon: '',
    nativeCurrency: { name: 'BERA', symbol: 'BERA', decimals: 18 },
    rpcUrls: {
      default: {
        http: ['https://bartio.rpc.berachain.com/'],
      }
    },
    blockExplorers: {
      default: {
        name: 'beratrail',
        url: 'https://bartio.beratrail.io'
      }
    }
  }
}

export const icons: Record<number, string> = {
  80084: '/images/berachain.png'
};

export default chains;

