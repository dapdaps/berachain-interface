import { providers } from "ethers";
import { useMemo } from "react";
import { useAccount, Config, useConnectorClient } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/configs";

function clientToProvider(client: any) {
  if (!client) return null;

  try {
    const { chain, transport, account } = client;

    if (!chain?.id) {
      return new providers.JsonRpcProvider(transport.url, {
        chainId: DEFAULT_CHAIN_ID,
        name: "Berachain Mainnet",
        ensAddress: "0x00000000000C2E074eC69A0d3389f35285E26295"
      });
    }

  const network = {
    chainId: chain?.id,
    name: chain?.name,
    ensAddress:  chain?.contracts?.ensRegistry?.address
  };

  if (transport.type === "fallback")
    return new providers.FallbackProvider(
      (transport.transports as ReturnType<any>[]).map(
        ({ value }) => new providers.JsonRpcProvider(value?.url, network)
      )
    );

    return account.address
    ? new providers.Web3Provider(transport, network)
    : new providers.JsonRpcProvider(transport.url, network);
  } catch (error) {
    console.error('Error in clientToProvider:', error);
    return null;
  }
}

export default function useCustomAccount() {
  const account = useAccount();
  const { data: client } = useConnectorClient<Config>({
    chainId: account ? account.chainId : DEFAULT_CHAIN_ID
  });

  const provider = useMemo(
    () => (client ? clientToProvider(client) : undefined),
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
