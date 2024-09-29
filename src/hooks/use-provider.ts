import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

export function useProvider() {
  const [provider, setProvider] = useState<any>();
  const [signer, setSigner] = useState<any>();
  const { address, chainId, connector } = useAccount();

  useEffect(() => {
    const init = async () => {
      const result = await connector?.getProvider?.();
      if (!result) return;
      const provider = new ethers.providers.Web3Provider(result, 'any');
      setProvider(provider);
      setSigner(provider?.getSigner?.(address));
    };

    if (connector && chainId) init();
  }, [connector, chainId, address]);

  return {
    provider,
    signer,
  }
}
