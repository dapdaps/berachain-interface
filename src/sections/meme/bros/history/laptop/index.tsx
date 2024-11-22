import Title from "../../components/title";
import Materials from "../../components/materials";
import Round from "../round";
import WithdrawalPanel from "../../components/withdrawal-panel";

export default function Laptop() {
  return (
    <div className="relative w-full overflow-x-hidden relative">
      <Title />
      <div
        className="text-[36px] font-SquaredPixel text-center text-white"
        style={{
          textShadow: "2px 0px #000, -2px 0px #000, 0px -2px #000, 0px 2px #000"
        }}
      >
        History
      </div>
      <div className="w-[1000px] mx-auto relative z-[10] pb-[20px] min-h-[100px]">
        <Round />
        <Round />
        <Round />
      </div>
      <div className="fixed w-full z-[1] bottom-0 left-0">
        <Materials />
        <div className="relative z-[5] w-full h-[240px] bg-[url(/images/meme/ground.png)] bg-contain" />
      </div>
      {/* <WithdrawalPanel /> */}
    </div>
  );
}
