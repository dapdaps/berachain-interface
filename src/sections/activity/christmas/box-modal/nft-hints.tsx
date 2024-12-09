export default function NftHints({ nft }: any) {
  return (
    <>
      <div className="text-[14px] font-medium mt-[6px]">
        You got a{" "}
        <span className="font-bold">
          {nft.name} #{nft.token_id}
        </span>
        , you can
      </div>
      <div className="text-[14px] font-medium">
        The NFT will send to your wallet in few days.
      </div>
    </>
  );
}
