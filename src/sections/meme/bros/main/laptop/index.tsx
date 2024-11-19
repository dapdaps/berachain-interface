import Title from "../../components/title";
import Tokens from "./tokens";
import Panel from "./panel";
import Total from "./total";
import WithdrawalPanel from "../../components/withdrawal-panel";
import StakeModal from "../../modals/stake";

export default function Laptop() {
  return (
    <div className="w-full overflow-x-hidden relative">
      <Title />
      <Total />
      <Tokens />
      <Panel />
      <WithdrawalPanel />
      <StakeModal />
    </div>
  );
}
