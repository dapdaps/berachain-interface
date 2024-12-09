import Basic from "./basic";
import Image from "next/image";
import TokenAmout from "@/sections/swap/TokenAmount";
import Button from "@/components/button/submit-button";
import Big from "big.js";
import { usePriceStore } from "@/stores/usePriceStore";
import { useMemo, useState } from "react";
import useStake from "../hooks/use-stake";
import { formatThousandsSeparator, balanceFormated } from "@/utils/balance";
import clsx from "clsx";
import { formatDistance } from "date-fns";

const ArrowIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
  >
    <path
      d="M10.3536 4.35355C10.5488 4.15829 10.5488 3.84171 10.3536 3.64645L7.17157 0.464466C6.97631 0.269204 6.65973 0.269204 6.46447 0.464466C6.2692 0.659728 6.2692 0.976311 6.46447 1.17157L9.29289 4L6.46447 6.82843C6.2692 7.02369 6.2692 7.34027 6.46447 7.53553C6.65973 7.7308 6.97631 7.7308 7.17157 7.53553L10.3536 4.35355ZM0 4.5H10V3.5H0V4.5Z"
      fill="black"
    />
  </svg>
);

export default function StakeModal({
  open,
  data,
  userData,
  onClose,
  onOpenModal,
  onSuccess
}: any) {
  const prices = usePriceStore((store: any) => store.price);
  const [amount, setAmount] = useState("");
  const [balance, setBalance] = useState("");
  const { loading, onStake } = useStake({
    token: data,
    amount,
    onSuccess
  });

  const errorTips = useMemo(() => {
    if (Number(amount || 0) === 0) return "Enter an amount";
    if (Big(amount).gt(balance || 0)) {
      return "Insufficient Balance";
    }
    return "";
  }, [amount, balance]);

  const [originAmount, targetAmount] = useMemo(() => {
    const _oa = userData[data.address]?.stakedAmount || 0;
    const _ta = Big(_oa)
      .add(amount || 0)
      .toString();
    return [formatThousandsSeparator(_oa, 2), formatThousandsSeparator(_ta, 2)];
  }, [userData, amount]);

  const [originWeight, targetWeight] = useMemo(() => {
    const _ow = Big(data?.total_dapped || 0).gt(0)
      ? Big(originAmount).div(data.total_dapped).mul(100).toString()
      : 0;
    const _tw = Big(data?.total_dapped || 0).gt(0)
      ? Big(targetAmount)
          .div(Big(data.total_dapped).add(amount || 0))
          .mul(100)
          .toString()
      : targetAmount
      ? 100
      : 0;
    return [balanceFormated(_ow, 4), balanceFormated(_tw, 4)];
  }, [data, originAmount, targetAmount, amount]);

  return (
    <Basic open={open} onClose={onClose} className="w-[520px]">
      <div className="flex gap-[18px]">
        <Image
          src={data.token.logo}
          width={60}
          height={60}
          alt={data.token.symbol}
          className="border border-[3px] border-black rounded-full"
        />
        <div>
          <div className="text-[20px] font-bold">{data.token.symbol}</div>
          <button
            className="text-[14px] underline"
            onClick={() => {
              onOpenModal(8, data);
            }}
          >
            Get {data.token.symbol}
          </button>
        </div>
      </div>
      <div className="mt-[20px]">
        <TokenAmout
          type="in"
          currency={data.token}
          prices={prices}
          amount={amount}
          outputCurrencyReadonly={true}
          onUpdateCurrencyBalance={(balance: any) => {
            setBalance(balance);
          }}
          onAmountChange={(val: any) => {
            setAmount(val);
          }}
        />
      </div>
      <div className="flex flex-col gap-[12px] mt-[20px] rounded-[12px] border border-[#373A53] p-[12px] text-[14px] font-medium">
        <div className="flex justify-between items-center">
          <div>Your Dapped</div>
          <div className="flex items-center gap-[8px]">
            <Image
              src={data.token.logo}
              width={16}
              height={16}
              alt={data.token.symbol}
              className="rounded-full"
            />
            <span
              className={clsx(originAmount !== targetAmount && "line-through")}
            >
              {originAmount}
            </span>
            {originAmount !== targetAmount && (
              <>
                {ArrowIcon}
                <span>{targetAmount}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Gauge Weight</div>
          <div className="flex items-center gap-[8px]">
            <span
              className={clsx(originWeight !== targetWeight && "line-through")}
            >
              {originWeight}%
            </span>
            {originAmount !== targetAmount && (
              <>
                {ArrowIcon}
                <span>{targetWeight}%</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div>Staking APR</div>
          <div className="flex items-center gap-[8px]">{data.apy || "-"}</div>
        </div>
      </div>
      <Button
        spender={data.stake_address}
        token={data.token}
        amount={amount}
        loading={loading}
        errorTips={errorTips}
        disabled={!!errorTips}
        onClick={onStake}
      >
        👊 Dap {data.token.symbol} up!
      </Button>
      <div className="flex items-center gap-[6px] text-[14px] py-[18px]">
        <div className="font-CherryBomb w-[20px] h-[20px] rounded-full bg-[#FFB7BF] text-center shrink-0">
          !
        </div>
        <div className="font-medium">
          The unstaked assets will available to be withdrawn in{" "}
          {formatDistance(Date.now(), Date.now() + data.delayTime)}.
        </div>
      </div>
    </Basic>
  );
}
