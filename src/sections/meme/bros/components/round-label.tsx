import CardLabel from "./card-label";
import { useMemo } from "react";
import { format } from "date-fns";

export default function RoundLabel({ round, ...rest }: any) {
  const [title, subTitle] = useMemo(() => {
    if (!round) return ["", ""];
    const _st = `${format(round.start_time * 1000, "MMM.dd, yyyy")} - ${format(
      round.end_time * 1000,
      "MMM.dd, yyyy"
    )}`;
    return [`Round ${round.round}`, _st];
  }, [round]);

  return <CardLabel title={title} subTitle={subTitle} {...rest} />;
}
