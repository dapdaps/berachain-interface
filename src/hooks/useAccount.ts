import { useAccount as useWagmiAccount, useChainId } from 'wagmi';
import chains from '@/configs/chains';
import { useMemo } from 'react';
import { providers } from 'ethers';

export default function useAccount() {
  const { address } = useWagmiAccount();
  const chainId = useChainId();
  const provider = useMemo(
    () =>
      chainId
        ? new providers.JsonRpcProvider(chains[chainId].rpcUrls.default.http[0])
        : null,
    [chainId]
  );

  return { account: address, chainId, provider };
}
