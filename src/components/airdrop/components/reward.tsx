import clsx from "clsx";
import AirdropButton from "@/components/airdrop/components/button";
import { numberFormatter } from "@/utils/number-formatter";
import useCustomAccount from "@/hooks/use-account";
import { useAppKit } from "@reown/appkit/react";
import { ChainId } from "@/configs/airdrop";
import { useSwitchChain } from "wagmi";

const AirdropReward = (props: any) => {
  const { className, data, claimed, claiming, endTime, onClaim } = props;
  const { account, chainId } = useCustomAccount();
  const modal = useAppKit();
  const { isPending, switchChain } = useSwitchChain();
  return (
    <div className={clsx("flex flex-col items-center gap-[10px]", className)}>
      <img
        src={
          data
            ? "/images/home-earth/airdrop/coin-bera.svg"
            : "/images/home-earth/airdrop/coin-bera-empty.svg"
        }
        alt=""
        className="w-[70px] h-[70px] object-contain pointer-events-none"
      />
      {data ? (
        <>
          <div className="flex items-end justify-center gap-[9px]">
            <div className="text-[#FFDC50] text-[32px] font-[400] leading-[90%] font-CherryBomb text-stroke-2-black">
              {numberFormatter(data?.amount, 2, true)}
            </div>
            <div className="text-black text-[16px] font-[400] leading-[90%] font-CherryBomb">
              $BERA
            </div>
          </div>
          {/* {!account && (
            <AirdropButton
              className="w-[240px] mt-[19px]"
              onClick={() => {
                modal.open();
              }}
            >
              Connect Wallet To Share
            </AirdropButton>
          )} */}
          {/* {account?.toLowerCase() === data.address.toLowerCase() && ( */}
          <div className="flex items-center gap-[14px]  mt-[19px]">
            <AirdropButton
              className="w-[220px]"
              onClick={() => {
                const url = `${location.href}api/twitter?address=${data.address}`;

                window.open(
                  `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    `McBera iz so dumb he bought everything in my Beracave for ${data.amount} $BERA!\nSell (claim airdrop) your @0xberatown bArtio items now:`
                  )}&url=${encodeURIComponent(url)}`
                );
              }}
            >
              Share on X
            </AirdropButton>
            {!account && (
              <AirdropButton
                className="w-[240px]"
                onClick={() => {
                  modal.open();
                }}
              >
                Connect Wallet To Claim
              </AirdropButton>
            )}
            {chainId !== ChainId ? (
              <AirdropButton
                className="w-[240px]"
                onClick={() => {
                  switchChain({ chainId: ChainId });
                }}
                loading={isPending}
                disabled={isPending}
              >
                Switch Network
              </AirdropButton>
            ) : (
              account?.toLowerCase() === data.address.toLowerCase() && (
                <AirdropButton
                  className="w-[220px]"
                  onClick={onClaim}
                  disabled={claimed || claiming || endTime < Date.now()}
                  loading={claiming}
                >
                  {claimed ? "Claimed" : "Claim"}
                </AirdropButton>
              )
            )}
          </div>
          {/* )} */}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center gap-[6px]">
          <div className="text-black text-[20px] font-[700] leading-normal">
            We are sorry
          </div>
          <div className="text-black text-[16px] font-[600] leading-normal">
            Your account does not have any airdrop allocation.
          </div>
        </div>
      )}
    </div>
  );
};

export default AirdropReward;
