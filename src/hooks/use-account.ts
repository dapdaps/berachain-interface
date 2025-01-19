import { providers } from "ethers";
import { useMemo } from "react";
import { useAccount, Config, useConnectorClient } from "wagmi";
import chains from "@/configs/chains";
import { DEFAULT_CHAIN_ID } from "@/configs";

function clientToProvider(client: any) {
  if (!client) return null;

  try {
    const { chain, transport } = client;
    if (!chain || !transport) return null;

    const network = {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address
    };

    if (transport.type === 'fallback') {
      return new providers.FallbackProvider(
        transport.transports?.map(({ value }: any) => 
          new providers.JsonRpcProvider(value?.url, network)
        ) || []
      );
    }

    return new providers.JsonRpcProvider(transport.url, network);
  } catch (error) {
    console.error('Error in clientToProvider:', error);
    return null;
  }
}

export default function useCustomAccount() {
  const account = useAccount();
  const { data: client } = useConnectorClient<Config>({
    chainId: DEFAULT_CHAIN_ID
  });

  const provider = useMemo(
    () =>
      client
        ? clientToProvider(client)
        : new providers.JsonRpcProvider(
            chains[DEFAULT_CHAIN_ID].rpcUrls.default.http[0]
          ),
    [client]
  );

  return useMemo<{
    chainId: number; 
    account: string;  
    provider?: any;
    chain: any;
  }>(
    () => ({
      account: account?.address || '',
      chainId: account?.chainId || DEFAULT_CHAIN_ID, // 使用默认 chainId
      provider,
      chain: account?.chain || null
    }),
    [account, provider]
  );
}
