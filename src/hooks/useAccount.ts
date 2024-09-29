import { JsonRpcProvider } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';
export default function useCustomAccount() {
  const account = useAccount();
  return useMemo<{ chainId?: number; account?: string; provider?: any }>(() => {
    return {
      account: account?.address ?? '',
      chainId: account?.chainId ?? -1,
      provider: new JsonRpcProvider('https://bartio.rpc.berachain.com/'),
      chain: account?.chain ?? null
    };
  }, [account]);
}
