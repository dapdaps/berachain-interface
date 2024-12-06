import Avatar from "../nft-prize-winners-modal/avatar";

export default function Nft() {
  return (
    <div className="w-1/3 flex items-center gap-[22px] mt-[15px]">
      <Avatar />
      <div className="font-semibold">
        <div className="text-[14px]">Beraboyz</div>
        {/* <div className="text-[10px] px-[6px] py-[3px] bg-[#D39924] rounded-[6px] text-white">
          Whitelist
        </div> */}
      </div>
    </div>
  );
}
