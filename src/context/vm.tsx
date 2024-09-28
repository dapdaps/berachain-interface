'use client';

import dynamic from 'next/dynamic';
import { EthersProviderContext } from 'near-social-vm';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';

const VmInitializer = dynamic(() => import('@/components/vm/initializer'), {
  ssr: false,
});

export default function VmProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [provider, setProvider] = useState<any>(null);
  const { chainId, connector } = useAccount();

  useEffect(() => {
    const init = async () => {
      const result = await connector?.getProvider?.();
      setProvider(result);
    };

    if (connector && chainId) init();
  }, [connector, chainId]);

  return (
    <>
      <VmInitializer />
      <EthersProviderContext.Provider value={{ provider }}>
        {children}
      </EthersProviderContext.Provider>
    </>
  );
}
