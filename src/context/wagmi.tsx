'use client';

import { wagmiAdapter, projectId, networks } from '@/configs/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createAppKit } from '@reown/appkit/react';
import React, { type ReactNode, useEffect, useState } from 'react';
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

const metadata = {
  name: 'BeraTown',
  description: 'Bera bArtio',
  url: '',
  icons: ['/favicon.ico'],
};

const defaultNetwork = networks.find((it) => it.id === 80084);

function ContextProvider({ children, cookies }: { children: ReactNode; cookies?: string | null }) {
  const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    createAppKit({
      adapters: [wagmiAdapter],
      projectId,
      networks: networks as any,
      defaultNetwork: defaultNetwork || networks[0],
      metadata,
      features: {
        analytics: true, // Optional - defaults to your Cloud configuration
      },
      enableInjected: true,
      enableWalletConnect: true,
      enableEIP6963: true,
      enableCoinbase: true,
    });
    setReady(true);
  }, []);

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {ready && children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default ContextProvider;
