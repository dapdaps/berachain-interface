import useCountDown, { getTimePeriods, toTwo } from "@/hooks/use-count-down";

export default function ClaimCountDown({ time = 0 }: any) {
  const { secondsRemaining } = useCountDown(time / 1000);
  const timeLeft = getTimePeriods(secondsRemaining);

  return (
    <div className="text-[26px] text-center font-bold font-CherryBomb">
      {toTwo(timeLeft.days)}d : {toTwo(timeLeft.hours)}h :{" "}
      {toTwo(timeLeft.minutes)}m : {toTwo(timeLeft.seconds)}s
    </div>
  );
}
