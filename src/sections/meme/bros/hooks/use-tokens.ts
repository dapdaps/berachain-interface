import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import useData from "./use-data";
import { get } from "@/utils/http";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
export default function useTokens() {
  const [tokens, setTokens] = useState<any>([]);
  const [rewardTokens, setRewardTokens] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const { provider } = useCustomAccount();
  const { currentRound } = useData();

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
      const response = await get(`/api/meme?round=${currentRound.round}`);
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const delayCalls = response.data.tokens.map((token: any) => ({
        address: token.stake_address,
        name: "unstakeDelayDays"
      }));
      const delayRes = await multicall({
        abi: stakeAbi,
        options: {},
        calls: delayCalls,
        multicallAddress,
        provider
      });

      setTokens(
        response.data.tokens.map((token: any, i: number) => {
          const _time = delayRes[i] ? delayRes[i][0]?.toString() : 0;
          return {
            delayTime: _time * 1000,
            ...token
          };
        })
      );
      setRewardTokens(
        response.data.reward_tokens.map((token: any) => {
          return {
            ...token,
            isNative:
              token.address === "0x0000000000000000000000000000000000000000"
          };
        })
      );
    } catch (err) {
      console.log(err);
      setTokens([]);
    } finally {
      setLoading(false);
    }
  }, [currentRound, provider]);

  useEffect(() => {
    if (provider && currentRound) onQuery();
  }, [provider, currentRound]);

  return { loading, tokens, rewardTokens, onQuery };
}
