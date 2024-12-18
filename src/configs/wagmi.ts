'use client';
import { cookieStorage, createStorage, fallback, http } from 'wagmi';
import chains from './chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { injected } from 'wagmi/connectors'
import { CreateConnectorFn } from 'wagmi'
import { berachainTestnetbArtio } from '@reown/appkit/networks';

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

export const networks = Object.values(chains).filter((c) => c.isWalletSupport);

const connectors: CreateConnectorFn[] = [];

// @ts-ignore
if (typeof window !== 'undefined' && window.berasig) {
  // @ts-ignore
  const berasig = window.berasig.ethereum;
  const BeraSig = (config: any) => {
    const Connector = injected({
      shimDisconnect: false,
      target: {
        id: 'BeraSig',
        icon: '/images/wallets/bera-sig-wallet.avif',
        name: 'BeraSig Wallet (Recommend)',
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
  // @ts-ignore
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks,
  // @ts-ignore
  connectors,
  transports: {
    [berachainTestnetbArtio.id]: fallback([
      http('https://bartio.rpc.berachain.com'),
      http('https://bartio.drpc.org'),
      http(`https://rpc.walletconnect.org/v1/?chainId=eip155%3A80084&projectId=${projectId}`),
    ])
  }
});

export const config = wagmiAdapter.wagmiConfig;
