import { useState, useEffect } from "react";
import useCustomAccount from "@/hooks/use-account";
import rewardAbi from "../abi/reward";
import { DEFAULT_CHAIN_ID } from "@/configs";
import { multicall, multicallAddresses } from "@/utils/multicall";

export default function useClaimData(rounds: any) {
  const [loading, setLoading] = useState(false);
  const { account, provider } = useCustomAccount();
  const [data, setData] = useState<any>();

  const onQuery = async () => {
    try {
      setLoading(true);
      const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
      const calls = rounds.map((round: any) => ({
        address: round.reward_address,
        name: "userNonces",
        params: [account]
      }));
      const res = await multicall({
        abi: rewardAbi,
        options: {},
        calls,
        multicallAddress,
        provider
      });
      const _d: any = {};
      res.forEach((item: any, i: number) => {
        _d[rounds[i].round] = item;
      });
      setData(_d);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account && rounds.length > 0) onQuery();
  }, [account, provider, rounds]);

  return { loading, data, onQuery };
}
