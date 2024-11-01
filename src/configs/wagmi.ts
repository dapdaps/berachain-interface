import { cookieStorage, createStorage } from 'wagmi';
import chains from './chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors'
import { http, WagmiProvider, CreateConnectorFn } from 'wagmi'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const metadata = {
  name: 'BeraTown',
  description: 'Bera bArtio',
  // origin must match your domain & subdomain
  url: 'https://berachain.dapdap.net',
  icons: ['/favicon.ico'],
};

export const networks = Object.values(chains);

const connectors: CreateConnectorFn[] = [];
connectors.push(walletConnect({ projectId, metadata, showQrModal: false })); // showQrModal must be false
const BeraSig = injected({
  target: {
    id: 'BeraSig',
    icon: '/images/wallets/bera-sig-wallet.avif',
    name: 'BeraSig',
    // @ts-ignore
    provider: window.berasig.ethereum
  }
});
connectors.push(
  coinbaseWallet({
    appName: metadata.name,
    appLogoUrl: metadata.icons[0]
  })
);
connectors.push(BeraSig);

// @ts-ignore
console.log(window.berasig.ethereum);

export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  connectors,
});

export const config = wagmiAdapter.wagmiConfig;
