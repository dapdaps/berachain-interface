'use client';
import { cookieStorage, createStorage } from 'wagmi';
import chains from './chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { walletConnect, coinbaseWallet, injected } from 'wagmi/connectors'
import { CreateConnectorFn } from 'wagmi'

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
connectors.push(
  coinbaseWallet({
    appName: metadata.name,
    appLogoUrl: metadata.icons[0]
  })
);

// @ts-ignore
if (window.berasig) {
  // @ts-ignore
  const berasig = window.berasig.ethereum;
  const BeraSig = (config: any) => {
    const Connector = injected({
      shimDisconnect: false,
      target: {
        id: 'BeraSig',
        icon: '/images/wallets/bera-sig-wallet.avif',
        name: 'BeraSig Wallet',
        // @ts-ignore
        provider: berasig,
      }
    })(config);
    return {
      ...Connector,
      disconnect: async () => {
        await Connector.disconnect();
        try {
          // TODO Useless
          await berasig.request({
            method: "eth_requestAccounts",
            params: [{ eth_accounts: {} }]
          });
          console.log('disconnect done');
        } catch (err: any) {
          console.log('disconnect failed: %o',  err);
        }
      },
    };
  };
  connectors.push(BeraSig);
}

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
