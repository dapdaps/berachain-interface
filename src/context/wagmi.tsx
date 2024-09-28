'use client';

import { config, projectId } from '@/configs/wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import React, { ReactNode, useEffect, useState } from 'react';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

if (!projectId) {
  throw new Error('Project ID is not defined');
}

function ContextProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: any;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    createWeb3Modal({
      wagmiConfig: config,
      projectId,
    });
    setReady(true);
  }, []);

  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>
        {ready && children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default ContextProvider;
