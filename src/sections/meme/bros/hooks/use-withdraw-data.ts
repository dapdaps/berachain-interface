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
        address: token.stake_address,
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
        const record = item[0][0];

        if (!record || record?.[2]) return;

        const _unlockTimestamp = Number(record[1].toString());
        _list.push({
          amount: Big(record[0].toString()).div(1e18).toString(),
          withdrawable:
            !record[2] && Math.floor(Date.now() / 1000) > _unlockTimestamp,
          unlockTimestamp: _unlockTimestamp * 1000,
          idx: i,
          ...tokens[i]
        });
      });
      setList(_list);
    } catch (err) {
      console.log(err);
      setList(null);
    } finally {
      setLoading(false);
    }
  }, [account, provider, tokens]);

  useEffect(() => {
    if (account && provider && tokens?.length) onQuery();
  }, [account, provider, tokens]);

  return { loading, list, onQuery };
}
