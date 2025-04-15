import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import Loading from "@/components/loading";
import useClaim from "../../hooks/use-claim";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";

const Claim = (props: any) => {
  const { className } = props;

  const { loading, onClaim } = useClaim();
  const { currentReward, currentProtocol } = useVaultsV2Context();

  const rewards = useMemo(
    () => (currentReward.splice ? currentReward : [currentReward]),
    [currentReward]
  );

  if (currentProtocol.protocol === "D2 Finance") return;

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="">Claim Rewards</div>
      {rewards.map((reward: any) => (
        <div
          className="mt-[30px] flex flex-col items-center"
          key={reward.address}
        >
          <LazyImage
            src={reward?.icon}
            width={36}
            height={36}
            containerClassName="shrink-0 rounded-full overflow-hidden"
            fallbackSrc="/assets/tokens/default_icon.png"
          />
          <div className="mt-[15px] text-[20px] font-[600]">
            {numberFormatter(reward?.amount, 6, true, {
              isShort: true,
              isShortUppercase: true
            })}{" "}
            {reward?.symbol}
          </div>
          {/*<div className="mt-[5px] text-[16px] font-[500]">*/}
          {/*  +{numberFormatter(currentReward?.usd, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}*/}
          {/*</div>*/}
        </div>
      ))}

      <button
        type="button"
        disabled={loading}
        className="w-full mt-[20px] flex justify-center items-center gap-[10px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
        onClick={onClaim}
      >
        {loading && <Loading size={16} />}
        <div className="">Claim</div>
      </button>
    </div>
  );
};

export default Claim;
