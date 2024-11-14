import Title from "./title";
import Tokens from "./tokens";
import Panel from "./panel";

export default function Laptop() {
  return (
    <div className="w-full overflow-x-hidden">
      <Title />
      <Tokens />
      <Panel />
    </div>
  );
}
