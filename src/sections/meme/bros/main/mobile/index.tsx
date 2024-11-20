import Title from "../../components/title";
import PageBack from "@/components/back";
import Total from "../total";
import Panel from "../panel";
import Tokens from "../tokens";
import Actions from "./actions";

export default function Mobile() {
  return (
    <div className="h-full w-full overflow-x-hidden relative pt-[18px]">
      <div className="absolute left-[18px] top-[18px]">
        <PageBack />
      </div>
      <Title />
      <Total />
      <Tokens />
      <Panel />
      <Actions />
    </div>
  );
}
