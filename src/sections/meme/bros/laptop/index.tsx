import Title from "./title";
import Tokens from "./tokens";
import Panel from "./panel";
import Total from "./total";
import WithdrawalPanel from "./withdrawal-panel";

export default function Laptop() {
  return (
    <div className="w-full overflow-x-hidden relative">
      <Title />
      <Total />
      <Tokens />
      <Panel />
      <WithdrawalPanel />
    </div>
  );
}
