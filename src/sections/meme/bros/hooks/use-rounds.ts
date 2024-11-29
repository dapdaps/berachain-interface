import { useCallback, useEffect, useState } from "react";
import useCustomAccount from "@/hooks/use-account";
import { useDebounceFn } from "ahooks";
import { get } from "@/utils/http";

export default function useRounds() {
  const [historyRounds, setHistoryRounds] = useState<any>([]);
  const [currentRound, setCurrentRound] = useState<any>();
  const [nextRound, setNextRound] = useState<any>();
  const [loading, setLoading] = useState(true);
  const { account } = useCustomAccount();

  const init = useCallback(async () => {
    try {
      setLoading(true);
      const result = await get(`/api/meme/list`);
      const _history: any = [];
      let current: any = null;
      let next: any = null;

      result.data.forEach((round: any) => {
        if (round.status === "ended") _history.push(round);
        if (round.status === "ongoing") current = round;

        if (
          round.status === "un_start" &&
          (!next?.start_time || round.start_time < next?.start_time)
        ) {
          next = round;
        }
      });
      if (_history.length)
        _history.sort((a: any, b: any) => b.end_time - a.end_time);
      if (!current && _history.length) current = _history[0];
      if (!current && result.data.length === 1) current = result.data[0];
      setHistoryRounds(_history);
      setCurrentRound(current);
      setNextRound(next);
    } catch (err) {
      console.log(err);
      setHistoryRounds([]);
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

  return { loading, historyRounds, currentRound, nextRound };
}
