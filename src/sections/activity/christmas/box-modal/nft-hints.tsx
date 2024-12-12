import { useMemo } from 'react';

export default function NftHints({ nft }: any) {
  const isToken = ["USDT", "USDC", "iBGT", "SUGAR"].includes(nft.name);
  const text = useMemo(() => {
    if (nft.whitelist) {
      return <span>Please send DM to <a href="https://x.com/0xberatown" rel="nofollow" target="_blank" className="underline decoration-solid">@0xberatown</a> on X to claim.</span>;
    }
    if (isToken) {
      return "The rewards will be distributed after the campaign ends.";
    }
    return "The NFT will send to your wallet in few days.";
  }, [nft]);

  return (
    <>
      <div className="text-[14px] font-medium mt-[6px]">
        You got {isToken ? "" : "a"}{" "}
        <span className="font-bold">
          {nft.amount ?? ''} {nft.name} {!nft.whitelist && !isToken ? `#${nft.token_id}` : ''}
        </span>
      </div>
      <div className="text-[14px] font-medium text-center">
        {text}
      </div>
    </>
  );
}
