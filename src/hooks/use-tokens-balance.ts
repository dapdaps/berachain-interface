import { utils } from "ethers";
import { flatten } from "lodash";
import { useCallback, useEffect, useState } from "react";
import multicallAddresses from "@/configs/contract/multicall";
import useAccount from "@/hooks/use-account";
import { multicall } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";

export default function useTokensBalance(tokens: any) {
  const [loading, setLoading] = useState(false);
  const [balances, setBalances] = useState<any>({});
  const { account, provider } = useAccount();

  const queryBalance = useCallback(async () => {
    if (!account || !tokens.length || !provider) return;
    const chainId = tokens[0].chainId || DEFAULT_CHAIN_ID;
    try {
      setLoading(true);
      let hasNative = false;
      const tokensAddress = tokens.filter((token: any) => {
        if (token.address === "native") hasNative = true;
        return token.address !== "native";
      });
      const calls = tokensAddress.map((token: any) => ({
        address: token.address,
        name: "balanceOf",
        params: [account]
      }));
      const multicallAddress = multicallAddresses[chainId];
      const requests = [];
      if (hasNative) requests.push(provider.getBalance(account));
      const splits = Math.ceil(calls.length / 20);
      for (let i = 0; i < splits; i++) {
        requests.push(
          multicall({
            abi: [
              {
                inputs: [
                  { internalType: "address", name: "account", type: "address" }
                ],
                name: "balanceOf",
                outputs: [
                  { internalType: "uint256", name: "", type: "uint256" }
                ],
                stateMutability: "view",
                type: "function"
              }
            ],
            options: {},
            calls:
              i === splits - 1
                ? calls.slice(i * 20)
                : calls.slice(i * 20, (i + 1) * 20),
            multicallAddress,
            provider
          })
        );
      }

      const res = await Promise.all(requests);
      const _balance: any = {};

      const results = flatten(res);

      for (let i = 0; i < results.length; i++) {
        if (hasNative) {
          _balance.native = utils.formatUnits(results[i], 18);
        }
        const token = tokensAddress[i];
        _balance[token.address] = utils.formatUnits(
          results[i]?.[0] || 0,
          token.decimals
        );
      }

      setBalances(_balance);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, [tokens, account, provider]);

  useEffect(() => {
    queryBalance();
  }, [account, provider, tokens]);

  return { loading, balances, queryBalance };
}
