import { providers } from "ethers";
import { useMemo } from "react";
import { useAccount, Config, useConnectorClient } from "wagmi";
import { DEFAULT_CHAIN_ID } from "@/configs";

function clientToProvider(client: any) {
  const { account, chain, transport } = client;
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address
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
}

export default function useCustomAccount() {
  const account = useAccount();
  const { data: client } = useConnectorClient<Config>({
    chainId: DEFAULT_CHAIN_ID
  });

  const provider = useMemo(
    () => (client ? clientToProvider(client) : undefined),
    [client]
  );

  return useMemo<{
    chainId?: number;
    account?: string;
    provider?: any;
  }>(
    () => ({
      account: account?.address ?? "",
      chainId: account?.chainId ?? -1,
      provider,
      chain: account?.chain ?? null
    }),
    [account, provider]
  );
}
