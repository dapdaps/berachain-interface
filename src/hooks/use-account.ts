import { providers } from 'ethers';
import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';
import chains from '@/configs/chains';
import { DEFAULT_CHAIN_ID } from '@/configs';

export default function useCustomAccount() {
  const account = useAccount();
  const [provider, setProvider] = useState<any>();

  useEffect(() => {
    const init = async () => {
      const _provider = await account.connector?.getProvider?.();
      if (_provider) {
        setProvider(new providers.Web3Provider(_provider));
      } else {
        setProvider(
          new providers.JsonRpcProvider(
            chains[DEFAULT_CHAIN_ID].rpcUrls.default.http[0]
          )
        );
      }
    };
    init();
  }, [account]);

  return useMemo<{
    chainId?: number;
    account?: string;
    provider?: any;
    signer?: any;
  }>(
    () => ({
      account: account?.address ?? '',
      chainId: account?.chainId ?? -1,
      provider,
      chain: account?.chain ?? null
    }),
    [account]
  );
}
