import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { multicall, multicallAddresses } from "@/utils/multicall";
import { DEFAULT_CHAIN_ID } from "@/configs";
import stakeAbi from "../abi/stake";
import Big from "big.js";

export default function useHistoryRounds() {
  const [rounds, setRounds] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const onQuery = useCallback(async () => {
    try {
      setLoading(true);
    } catch (err) {
      console.log(err);
      setRounds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    onQuery();
  }, []);

  return { loading, rounds, onQuery };
}
