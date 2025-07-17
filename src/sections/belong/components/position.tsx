import useCustomAccount from "@/hooks/use-account";
import { TOKEN_ABI } from "@/hooks/use-token-balance";
import { numberFormatter } from "@/utils/number-formatter";
import { useRequest } from "ahooks";
import Big from "big.js";
import clsx from "clsx";
import { Contract } from "ethers";
import { forwardRef, useImperativeHandle, useMemo } from "react";

const Position = (props: any, ref: any) => {
  const { className, leverage, apy, market, setShareModalOpen } = props;

  const { account, provider } = useCustomAccount();

  const { data: positionBalance, runAsync: getPositionBalance } = useRequest(async () => {
    if (!account || !provider || !market) {
      return;
    }

    const contract = new Contract(market.beraborrowToken, TOKEN_ABI, provider);
    const balance = await contract.balanceOf(account);
    const balanceValue = balance ? Big(balance.toString()).div(10 ** market.decimals) : Big(0);
    return {
      balance: balanceValue,
      balanceUsd: balanceValue.mul(market.collPrice),
    };
  }, {
    refreshDeps: [
      account,
      provider,
      market,
    ],
    pollingInterval: 15000,
  });
  const yourPosition = useMemo(() => {
    let _yourPosition = Big(0);
    if (market?.balanceUsd) {
      _yourPosition = Big(_yourPosition).plus(market.balanceUsd);
    }
    if (positionBalance?.balanceUsd) {
      _yourPosition = Big(_yourPosition).plus(positionBalance.balanceUsd);
    }
    return _yourPosition;
  }, [positionBalance, market]);

  const refs = {
    getPositionBalance,
  };
  useImperativeHandle(ref, () => refs);

  return (
    <div className={clsx("overflow-hidden bg-[#FFFDEB] rounded-[10px] border border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)] relative p-[15px_20px] w-full text-[14px] text-black font-[700] font-Montserrat leading-normal flex justify-between items-center gap-[10px]", className)}>
      <div className="flex items-center gap-[15px]">
        <div className="">
          <div className="text-[12px] text-[#A1A0A1] font-[500]">
            Your position
          </div>
          <div className="mt-[0px]">
            {numberFormatter(yourPosition, 2, true, { prefix: "$", isShort: true, isShortUppercase: true })}
          </div>
        </div>
        <div className="">
          <div className="text-[12px] text-[#A1A0A1] font-[500]">
            Leverage
          </div>
          <div className="mt-[0px]">
            {leverage}x
          </div>
        </div>
        <div className="">
          <div className="text-[12px] text-[#A1A0A1] font-[500]">
            APR
          </div>
          <div className="mt-[0px] text-[#7EA82B]">
            {numberFormatter(apy, 2, true, { prefix: "+ " })}%
          </div>
        </div>
      </div>
      <button
        type="button"
        className="shrink-0 flex justify-center items-center p-[4px_8px] rounded-[6px] border border-black bg-[#rgba(248,248,248,0.08)] gap-[8px] text-[#0F0F0F] text-[12px] uppercase font-[600] font-Montserrat"
        onClick={() => {
          setShareModalOpen?.(true);
        }}
      >
        <div className="">share</div>
        <div className="">&gt;</div>
      </button>
      <div className="bg-[#FFDC50] w-[6px] h-full absolute left-0 top-0" />
    </div>
  );
};

export default forwardRef(Position);
