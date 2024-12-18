import Avatar from "../nft-prize-winners-modal/avatar";

export default function Nft({ nft }: any) {
  return (
    <div className="w-1/3 flex items-center gap-[22px] mt-[15px] md:w-full md:flex-col md:gap-[10px]">
      <Avatar logo={nft.logo} amount={nft.nfts.length} />
      <div className="font-semibold md:flex md:flex-col md:items-center md:text-center">
        <div className="text-[14px]">{nft.name}</div>
        {nft.whitelist && (
          <div className="w-[59px] text-[10px] px-[6px] py-[3px] bg-[#D39924] rounded-[6px] text-white">
            Whitelist
          </div>
        )}
      </div>
    </div>
  );
}
