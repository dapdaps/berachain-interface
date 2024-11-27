import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";
import { cloneDeep } from "lodash";
import { usePriceStore } from "@/stores/usePriceStore";

export default function useHistoryStakeData(rounds: any) {
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const prices: any = usePriceStore((store) => store.price);

  const onQueryRound = async (round: any, list: any) => {
    const calls = round.tokens.map((token: any) => ({
      address: token.stake_address,
      name: "userStakes",
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
      if (!res[i]) return;
      const _amount = Big(res[i][0].toString()).div(1e18).toString();
      const price = prices[round.token.symbol] || prices[round.token.priceKey];

      const _amountUSD = price ? Big(price).mul(_amount).toString() : 0;
      list.push({
        stakedAmount: Big(res[i].toString()).div(1e18).toString(),
        stakedAmountUSD: _amountUSD,
        ...round,
        token: round.tokens[i]
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
