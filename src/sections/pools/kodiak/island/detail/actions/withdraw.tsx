import Image from "next/image";
import Range from "@/components/range";
import Button from "@/components/button";
import WithdrawModal from "../action-modal/withdraw-modal";
import clsx from "clsx";
import { useMemo, useState } from "react";
import Big from "big.js";
import { balanceFormated } from "@/utils/balance";

export default function Withdraw({ data, info, onSuccess }: any) {
  const [percent, setPercent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [amount0, amount1, amount] = useMemo(() => {
    return [
      Big(info.withdraw.amount0)
        .mul(percent / 100)
        .toString(),
      Big(info.withdraw.amount1)
        .mul(percent / 100)
        .toString(),
      Big(info.balance)
        .mul(percent / 100)
        .toString()
    ];
  }, [info, percent]);

  const errorTips = useMemo(() => {
    if (Big(info?.balance || 0).eq(0)) return "Insufficient Balance";
    if (percent === 0) return "Select a percentage";
    return "";
  }, [percent, info]);

  return (
    <>
      <div className="rounded-[12px] bg-white border-[#373A53] border p-[12px] mt-[16px]">
        <div className="flex items-center gap-[5px]">
          <div className="flex items-center">
            <Image
              src={data.token0.icon}
              alt={data.token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <Image
              src={data.token1.icon}
              alt={data.token1.name}
              width={26}
              height={26}
              className="rounded-full ml-[-8px]"
            />
          </div>
          <div>
            <div className="text-[16px] font-semibold">
              {data.token0.symbol}-{data.token1.symbol}
            </div>
          </div>
        </div>
        <div className="mt-[16px] flex items-center gap-[6px] text-[14px]">
          {[25, 50, 75, 100].map((item) => (
            <button
              className={clsx(
                "w-[42px] h-[22px] border border-[#373A53] rounded-[6px]",
                item === percent && "bg-[#FFDC50]"
              )}
              key={item}
              onClick={() => {
                setPercent(item);
              }}
            >
              {item === 100 ? "Max" : item + "%"}
            </button>
          ))}
        </div>
        <Range
          value={percent}
          onChange={(ev: any) => {
            setPercent(ev.target.value);
          }}
        />
      </div>
      <div className="rounded-[12px] border border-[#373A53] p-[14px] mt-[14px]">
        <div className="flex items-center justify-between">
          <div className="text-[14px] font-medium">
            Pooled {data.token0.symbol}
          </div>
          <div className="flex items-center justify-end gap-[5px]">
            <Image
              src={data.token0.icon}
              alt={data.token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="text-[16px] font-semibold">
              {balanceFormated(amount0, 6)}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-[14px]">
          <div className="text-[14px] font-medium">
            Pooled {data.token1.symbol}
          </div>
          <div className="flex items-center justify-end gap-[5px]">
            <Image
              src={data.token1.icon}
              alt={data.token1.name}
              width={26}
              height={26}
              className="rounded-full ml-[-8px]"
            />
            <div className="text-[16px] font-semibold">
              {balanceFormated(amount1, 6)}
            </div>
          </div>
        </div>
      </div>
      <Button
        disabled={!!errorTips}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          setShowModal(true);
        }}
      >
        {errorTips || "Withdraw"}
      </Button>
      {showModal && (
        <WithdrawModal
          data={data}
          info={info}
          amount={amount}
          amount0={amount0}
          amount1={amount1}
          percent={percent}
          open={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          onSuccess={() => {
            setShowModal(false);
            onSuccess();
          }}
        />
      )}
    </>
  );
}
