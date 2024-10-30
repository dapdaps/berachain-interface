import { cookieStorage, createStorage } from 'wagmi';
import chains from './chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = Object.values(chains);

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
});

export const config = wagmiAdapter.wagmiConfig;
