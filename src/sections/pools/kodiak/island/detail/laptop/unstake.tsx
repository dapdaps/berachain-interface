import Button from "@/components/button";
import { balanceFormated } from "@/utils/balance";
import Image from "next/image";
import { useMemo } from "react";
import useUnstake from "../../hooks/use-unstake";

const Item = ({ token0, token1, item }: any) => {
  return (
    <div className="rounded-[12px] border border-[#373A53] bg-white p-[14px] mt-[16px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <div className="flex items-center">
            <Image
              src={token0.icon}
              alt={token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <Image
              src={token1.icon}
              alt={token1.name}
              width={26}
              height={26}
              className="rounded-full ml-[-8px]"
            />
          </div>
          <div>
            <div className="text-[16px] font-semibold">
              {token0.symbol}-{token1.symbol}
            </div>
          </div>
        </div>
        <div className="text-[16px] font-semibold">
          {balanceFormated(item.amount0, 5)}/{balanceFormated(item.amount1, 5)}
        </div>
      </div>
      <div className="flex justify-end">
        <div className="text-center rounded-[6px] bg-[#7587FF] w-[50px] leading-[24px] text-white text-[14px] font-semibold">
          x{item.multiplier}
        </div>
      </div>
      <div className="flex justify-end items-center gap-[10px] mt-[14px]">
        {!item.unlocked && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="15"
            viewBox="0 0 13 15"
            fill="none"
          >
            <rect
              x="1"
              y="6"
              width="11"
              height="8"
              rx="2"
              stroke="#7587FF"
              strokeWidth="2"
            />
            <path
              d="M9 6V3.5C9 2.11929 7.88071 1 6.5 1V1C5.11929 1 4 2.11929 4 3.5V6"
              stroke="#7587FF"
              strokeWidth="2"
            />
          </svg>
        )}
        {!item.unlocked && (
          <div className="text-[16px] font-semibold">
            in {Math.ceil((item.ending_timestamp - Date.now() / 1000) / 86400)}{" "}
            days
          </div>
        )}
      </div>
    </div>
  );
};

export default function Unstake({ data, info, onSuccess }: any) {
  const kekIds = useMemo(
    () =>
      info.locked.items
        .filter((item: any) => item.unlocked)
        .map((item: any) => item.kek_id),
    [info]
  );
  const { loading, onUnstake } = useUnstake({
    farmContract: data.farmAddress,
    kekIds,
    onSuccess
  });
  return (
    <>
      {info.locked.items.map((item: any) => (
        <Item
          key={item.kek_id}
          token0={data.token0}
          token1={data.token1}
          item={item}
        />
      ))}
      <Button
        disabled={!kekIds.length}
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        loading={loading}
        onClick={onUnstake}
      >
        {!!kekIds.length ? "Unstake" : "None Positions"}
      </Button>
    </>
  );
}
