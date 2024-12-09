import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";
import { cloneDeep } from "lodash";

export default function useHistoryWithdrawData(rounds: any) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();

  const onQueryRound = async (round: any, list: any) => {
    const calls = round.tokens.map((token: any) => ({
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

    res.forEach((item: any, i: number) => {
      if (item.length === 0) return;
      item[0].forEach((record: any, j: number) => {
        if (!record || record?.[2]) return;

        const _unlockTimestamp = Number(record[1].toString());
        list.push({
          amount: Big(record[0].toString()).div(1e18).toString(),
          withdrawable:
            !record[2] && Math.floor(Date.now() / 1000) > _unlockTimestamp,
          unlockTimestamp: _unlockTimestamp * 1000,
          idx: j,
          ...round.tokens[i]
        });
      });
    });
  };

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
      let _data: any = [];
      const _rounds = cloneDeep(rounds);
      while (_rounds.length) {
        const round = _rounds.shift();
        await onQueryRound(round, _data);
      }
      setData(_data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [account, provider, rounds]);

  useEffect(() => {
    if (account && provider && rounds?.length) onQuery();
  }, [account, provider, rounds]);

  return { loading, data, onQuery };
}
