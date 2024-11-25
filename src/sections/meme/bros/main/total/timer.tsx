import { useMemo } from "react";
import RoundLabel from "../../components/round-label";
import useCountdown from "@/hooks/use-count-down";
import clsx from "clsx";

export default function Timer() {
  const { secondsRemaining } = useCountdown(
    Math.ceil(new Date("2024-12-10").getTime() / 1000)
  );
  const [timer, isEnded] = useMemo(() => {
    const d = Math.floor(secondsRemaining / 86400);
    const h = Math.floor((secondsRemaining - d * 86400) / 3600);
    const m = Math.floor((secondsRemaining - d * 86400 - h * 3600) / 60);
    const s = Math.floor(secondsRemaining - d * 86400 - h * 3600 - m * 60);
    if (!d && !h && !m && !s) return ["Round 1 Ended", true];
    const toTwo = (n: any) => (n < 10 ? "0" + n : n);
    return [
      `${toTwo(d) + " d "}${toTwo(d) + " : "}${toTwo(m) + " : "}${toTwo(s)}`,
      false
    ];
  }, [secondsRemaining]);
  return (
    <RoundLabel
      title={timer}
      contentClassName={clsx(isEnded && "!bg-[#FF7C3B]")}
      shadowClassName={clsx(isEnded && "!bg-[#924016]")}
    />
  );
}
