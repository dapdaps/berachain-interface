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
      let nativeToken: any = null;
      const tokensAddress = tokens.filter((token: any) => {
        if (token.address === "native" || token.isNative) nativeToken = token;
        return !(token.address === "native" || token.isNative);
      });
      const calls = tokensAddress.map((token: any) => ({
        address: token.address,
        name: "balanceOf",
        params: [account]
      }));

      const multicallAddress = multicallAddresses[chainId];
      const requests = [];

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

      if (nativeToken) {
        const nativeBalance = await provider.getBalance(account);
        _balance[nativeToken.address] = utils.formatUnits(nativeBalance, 18);
      }

      for (let i = 0; i < results.length; i++) {
        if (!results[i]) continue;
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
