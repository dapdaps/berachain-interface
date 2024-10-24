import { Chain } from 'viem';
import { mainnet, berachainTestnetbArtio } from 'viem/chains';

const chains: Record<number, Chain | any> = {
  [berachainTestnetbArtio.id]: berachainTestnetbArtio,
  [mainnet.id]: mainnet,
};

export const icons: Record<number, string> = {
  80084: '/images/berachain.png',
  1: '/images/eth.svg',
};

export default chains;
