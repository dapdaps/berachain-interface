import { providers } from "ethers";
import { useState } from "react";
import chains from "@/configs/chains";
import multicallAddresses from "@/configs/contract/multicall";
import { multicall } from "@/utils/multicall";

export default function useTokenInfo() {
  const [loading, setLoading] = useState(false);

  const queryToken = async ({ address, chainId, callback }: any) => {
    try {
      if (!address) throw "No address";
      const rpcUrl = chains[chainId]?.rpcUrls?.default.http[0];

      if (!rpcUrl) throw "No rpcUrl";
      setLoading(true);
      const multicallAddress = multicallAddresses[chainId];
      const calls = [
        { address, name: "name" },
        { address, name: "symbol" },
        { address, name: "decimals" }
      ];
      const result = await multicall({
        abi: [
          {
            inputs: [],
            name: "name",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [],
            name: "symbol",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function"
          },
          {
            inputs: [],
            name: "decimals",
            outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function"
          }
        ],
        options: {},
        calls,
        multicallAddress,
        provider: new providers.JsonRpcProvider(rpcUrl)
      });
      callback(result);
    } catch (err) {
      console.log(53, err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, queryToken };
}
