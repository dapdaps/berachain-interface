import { useMemo } from "react";
import CardLabel from "../../components/card-label";
import useCountdown from "@/hooks/use-count-down";
import useData from "../../hooks/use-data";
import clsx from "clsx";

export default function Timer() {
  const { currentRound } = useData();
  const { secondsRemaining } = useCountdown(currentRound?.end_time || 0);
  const [timer, isEnded] = useMemo(() => {
    if (secondsRemaining === 0)
      return [`Round ${currentRound?.round} Ended`, true];
    const d = Math.floor(secondsRemaining / 86400);
    const h = Math.floor((secondsRemaining - d * 86400) / 3600);
    const m = Math.floor((secondsRemaining - d * 86400 - h * 3600) / 60);
    const s = Math.floor(secondsRemaining - d * 86400 - h * 3600 - m * 60);

    const toTwo = (n: any) => (n < 10 ? "0" + n : n);
    return [
      `${toTwo(d) + " d "}${toTwo(h) + " : "}${toTwo(m) + " : "}${toTwo(s)}`,
      false
    ];
  }, [secondsRemaining]);
  return (
    <CardLabel
      title={timer}
      contentClassName={clsx(isEnded && "!bg-[#FF7C3B]")}
      shadowClassName={clsx(isEnded && "!bg-[#924016]")}
    />
  );
}
