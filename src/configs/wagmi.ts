import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { Chain } from 'viem';
import chains from './chains';

export const projectId = 'd7ba775b30586e6134cb4a77dd5edfcd'; // process.env.NEXT_PUBLIC_PROJECT_ID

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const config: any = defaultWagmiConfig({
  projectId,
  chains: Object.values(chains) as [Chain],
  metadata: {
    name: '',
    description: '',
    url: '',
    icons: ['/favicon.ico'],
  },
  enableInjected: true,
  enableWalletConnect: true,
  enableEIP6963: true,
  enableCoinbase: true,
  // enableEmail: false,
  storage: createStorage({
    storage: cookieStorage,
  }),
  ssr: true,
});
