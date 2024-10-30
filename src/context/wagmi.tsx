'use client';

import { wagmiAdapter, projectId, networks } from '@/configs/wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

const metadata = {
  name: 'BeraTown',
  description: 'Bera bArtio',
  // origin must match your domain & subdomain
  url: 'https://berachain.dapdap.net',
  icons: ['/favicon.ico'],
};

const defaultNetwork = networks.find((it) => it.id === 80084);

// Create the modal
const modal = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  networks: networks as any,
  defaultNetwork: defaultNetwork || networks[0],
  metadata: metadata,
  featuredWalletIds: [
    'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96',
    '971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709',
    '38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662',
    '8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4',
  ],
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: true,
    socials: ['google', 'x', 'github', 'discord', 'apple', 'facebook', 'farcaster'],
    emailShowWallets: true, // default to true
  },
  allWallets: 'SHOW'
})

function ContextProvider({
  children,
  cookies,
}: {
  children: ReactNode;
  cookies?: string | null;
}) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
