import clsx from "clsx";

export default function Nft({ nft }: any) {
  return (
    <div className="w-[150px] h-[154px] md:w-full rounded-[10px] bg-black/5 flex flex-col items-center relative shrink-0">
      <img
        src={nft.logo}
        className={clsx(
          "w-[100px] h-[100px] rounded-[10px] mt-[15px]",
          nft.owned && "opacity-50"
        )}
      />
      <div className="text-[12px] font-semibold mt-[8px]">
        {nft.name} #{nft.token_id}
      </div>
      {nft.owned && (
        <div className="absolute top-[50px] w-[127px] h-[32px] rounded-[6px] border border-black bg-[#98FF88] rotate-[-15deg] text-[12px] font-semibold">
          <div className="text-center">Owned by</div>
          <div className="text-center mt-[-6px]">
            {nft.owned.slice(0, 5)}...{nft.owned.slice(-4)}
          </div>
        </div>
      )}
    </div>
  );
}
