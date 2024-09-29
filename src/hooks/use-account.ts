import { providers } from 'ethers';
import { useMemo } from 'react';
import { useAccount } from 'wagmi';

export default function useCustomAccount() {
  const account = useAccount();
  return useMemo<{
    chainId?: number;
    account?: string;
    provider?: any;
    chain?: any;
  }>(() => {
    return {
      account: account?.address ?? '',
      chainId: account?.chainId ?? -1,
      provider: new providers.JsonRpcProvider(
        'https://bartio.rpc.berachain.com/'
      ),
      chain: account?.chain ?? null
    };
  }, [account]);
}
