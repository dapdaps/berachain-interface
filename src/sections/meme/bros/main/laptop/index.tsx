import Title from "../../components/title";
import Tokens from "../tokens";
import Panel from "../panel";
import Total from "../total";
import WithdrawalPanel from "../../components/withdrawal-panel";

export default function Laptop({ onOpenModal }: any) {
  return (
    <div className="w-full overflow-x-hidden relative">
      <Title onOpenModal={onOpenModal} />
      <Total />
      <Tokens />
      <Panel onOpenModal={onOpenModal} />
      <WithdrawalPanel />
    </div>
  );
}
