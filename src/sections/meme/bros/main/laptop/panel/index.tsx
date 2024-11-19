import Materials from "../../../components/materials";
import Tokens from "./tokens";

export default function Panel() {
  return (
    <div className="relative mt-[220px]">
      <Materials />
      <div className="relative z-[5] py-[45px] w-full bg-[url(/images/meme/ground.png)] bg-contain">
        <Tokens />
      </div>
    </div>
  );
}
