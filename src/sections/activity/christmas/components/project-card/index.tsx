import CheckButton from "../check-button";
import Button from "../../task-modal/button";

export default function ProjectCard() {
  return (
    <div className="relative w-[230px] h-[358px] p-[20px] rounded-[20px] border border-black bg-[#B5956E] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset]">
      <CheckButton
        number={"1 / 2"}
        checked={false}
        className="!absolute top-[-18px] left-[50px] bg-[#DCBC95] w-[126px] shadow-[-20px_26px_60px_0px_rgba(0, 0, 0, 0.20)_inset]"
      />
      <img src="" className="w-[180px] h-[180px] rounded-[10px]" />
      <div className="text-center text-[20px] font-bold mt-[16px]">Beraji</div>
      <div className="text-center text-[14px] font-medium">NFT, Wallet</div>
      <Button className="w-full mt-[12px]">Check</Button>
    </div>
  );
}
