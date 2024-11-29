import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { useDebounceFn } from "ahooks";
import { get } from "@/utils/http";

export default function useHistoryRounds() {
  const [rounds, setRounds] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { account } = useCustomAccount();

  const init = useCallback(async () => {
    try {
      setLoading(true);
      const response = await get(`/api/meme/history?account=${account}`);
      setRounds(response.data);
    } catch (err) {
      console.log(err);
      setRounds([]);
    } finally {
      setLoading(false);
    }
  }, [account]);

  const { run } = useDebounceFn(
    () => {
      init();
    },
    { wait: 500 }
  );

  useEffect(() => {
    run();
  }, [account]);

  return { loading, rounds };
}
