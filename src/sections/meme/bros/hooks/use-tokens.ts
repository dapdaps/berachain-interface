import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";
import { TOKENS } from "../config";

export default function useTokens() {
  const [tokens, setTokens] = useState<any>([]);
  const [totalStaked, setTotalStaked] = useState("");
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const stakedCalls = Object.values(TOKENS).map((token: any) => ({
        address: token.stakeAddress,
        name: "totalStakedAmount"
      }));
      const stakedRes = await multicall({
        abi: stakeAbi,
        options: {},
        calls: stakedCalls,
        multicallAddress,
        provider
      });
      const _tokens: any = [];
      let _total = Big(0);

      Object.values(TOKENS).forEach((token: any, i: number) => {
        const _amount = Big(stakedRes[i][0].toString()).div(1e18).toString();
        const _amountUSD = _amount;
        _tokens.push({
          ...token,
          stakedAmount: _amount,
          stakedAmountUSD: _amountUSD
        });
        _total = _total.add(_amountUSD);
      });

      setTokens(
        _tokens.sort((a: any, b: any) =>
          Big(a.stakedAmount).gt(b.stakedAmount) ? -1 : 1
        )
      );
      setTotalStaked(_total.toString());
    } catch (err) {
      console.log(err);
      setTokens(Object.values(TOKENS));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (provider) onQuery();
  }, [provider]);

  return { loading, totalStaked, tokens, onQuery };
}
