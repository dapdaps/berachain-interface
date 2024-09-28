import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { cookieStorage, createStorage } from 'wagmi';
import { Chain } from 'viem';
import chains from './chains';

export const projectId = '773dc7d5f848781b9142ac2ba77847a0'; // process.env.NEXT_PUBLIC_PROJECT_ID

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
