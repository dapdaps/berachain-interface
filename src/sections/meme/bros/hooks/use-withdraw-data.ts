import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";

export default function useWithdrawData(tokens: any) {
  const [list, setList] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);

      const calls = tokens.map((token: any) => ({
        address: token.stakeAddress,
        name: "getUnstakeEntries",
        params: [account]
      }));
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const res = await multicall({
        abi: stakeAbi,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      const _list: any = [];

      res.forEach((item: any, i: number) => {
        if (item.withdrawn) return;
        _list.push({
          amount: Big(item.amount).div(1e18).toString(),
          withdrawable:
            !item.withdrawn &&
            Math.floor(Date.now() / 1000) > item.unlockTimestamp,
          unlockTimestamp: item.unlockTimestamp * 1000,
          ...tokens[i]
        });
      });

      setList(_list);
    } catch (err) {
      setList(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (account && tokens?.length) onQuery();
  }, [account, tokens]);

  return { loading, list, onQuery };
}
