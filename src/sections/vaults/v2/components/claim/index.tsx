import clsx from "clsx";
import LazyImage from "@/components/layz-image";
import Loading from "@/components/loading";
import useClaim from "../../hooks/use-claim";
import { useVaultsV2Context } from "@/sections/vaults/v2/context";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";
import { usePriceStore } from '@/stores/usePriceStore';
import Big from 'big.js';
import { useSwitchChain } from "wagmi";
import useAccount from "@/hooks/use-account";
import { DEFAULT_CHAIN_ID } from "@/configs";

const Claim = (props: any) => {
  const { className } = props;

  const { loading, onClaim } = useClaim();
  const { currentReward, currentProtocol } = useVaultsV2Context();
  const prices = usePriceStore(store => store.beraTownPrice);
  const { isPending: switching, switchChain } = useSwitchChain();
  const { account, chainId } = useAccount();

  const rewards = useMemo(
    () => (currentReward.splice ? currentReward : [currentReward]),
    [currentReward]
  );

  const [buttonText, buttonLoading] = useMemo(() => {
    let _text = "Claim";
    let _loading = loading;

    if (DEFAULT_CHAIN_ID !== chainId) {
      _text = "Switch Network";
      _loading = switching;
    }

    return [_text, _loading];
  }, [account, chainId, loading, switching]);

  if (currentProtocol.protocol === "D2 Finance") return;

  const getRewardUsd = (reward: any) => {
    if (!reward) return null;
    let price = prices[reward.symbol];
    if (!price) {
      price = prices[reward.address];
    }
    if (!price) return null;
    return numberFormatter(Big(price).times(reward.amount || 0), 2, true, { prefix: "$", isShort: true, isShortUppercase: true, isZeroPrecision: true });
  };

  return (
    <div
      className={clsx(
        "text-black font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      <div className="">Claim Rewards</div>
      {rewards.map((reward: any) => {
        const rewardUsd = getRewardUsd(reward);
        return (
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
              })}{rewardUsd && `(${rewardUsd})`}&nbsp;&nbsp;
              {reward?.symbol}
            </div>
            {/*<div className="mt-[5px] text-[16px] font-[500]">*/}
            {/*  +{numberFormatter(currentReward?.usd, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}*/}
            {/*</div>*/}
          </div>
        );
      })}

      <button
        type="button"
        disabled={loading}
        className="w-full mt-[20px] flex justify-center items-center gap-[10px] disabled:opacity-30 disabled:!cursor-not-allowed h-[50px] rounded-[10px] border border-[#000] bg-[#FFDC50] text-[#000] text-center font-Montserrat text-[16px] font-semibold leading-normal"
        onClick={() => {
          if (DEFAULT_CHAIN_ID !== chainId) {
            switchChain({
              chainId: DEFAULT_CHAIN_ID
            });
            return;
          }
          onClaim();
        }}
      >
        {buttonLoading && <Loading size={16} />}
        <div className="">{buttonText}</div>
      </button>
    </div>
  );
};

export default Claim;
