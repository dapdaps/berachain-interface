import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";
import { usePriceStore } from "@/stores/usePriceStore";

export default function useUserData(tokens: any) {
  const [userData, setUserData] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const prices: any = usePriceStore((store) => store.price);

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);

      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];

      const stakedCalls = tokens.map((token: any) => ({
        address: token.stake_address,
        name: "userStakes",
        params: [account]
      }));

      const stakedRes = await multicall({
        abi: stakeAbi,
        options: {},
        calls: stakedCalls,
        multicallAddress,
        provider
      });

      const _data: any = {};

      tokens.forEach((token: any, i: number) => {
        if (!stakedRes[i]) return;
        const _amount = Big(stakedRes[i][0].toString()).div(1e18).toString();
        const price =
          prices[token.token.symbol] || prices[token.token.priceKey];

        const _amountUSD = price ? Big(price).mul(_amount).toString() : 0;
        _data[token.token.address] = {
          stakedAmount: Big(stakedRes[i].toString()).div(1e18).toString(),
          stakedAmountUSD: _amountUSD
        };
      });
      setUserData(_data);
    } catch (err) {
      console.log("user data error", err);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, [tokens]);

  useEffect(() => {
    if (account && provider && tokens.length) onQuery();
  }, [account, provider, tokens]);

  return { loading, userData, onQuery };
}
