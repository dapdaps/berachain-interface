import { useCountDown } from "@/sections/kingdomly/hooks/use-count-down";

export default function ClaimCountDown({ time }: any) {
  const countdown = useCountDown({
    targetTimestamp: time,
    format: "DDd : HHh : mmm : sss"
  });
  return (
    <div className="text-[26px] text-center font-bold font-CherryBomb">
      {countdown}
    </div>
  );
}
