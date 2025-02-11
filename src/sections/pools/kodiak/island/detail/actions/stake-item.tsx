import clsx from "clsx";
import { balanceFormated } from "@/utils/balance";

const Item = ({ token0, token1, item, active, onClick }: any) => {
  return (
    <div
      className={clsx(
        "rounded-[12px] border border-[#373A53] bg-white p-[14px] mt-[16px] text-[16px] md:text-[14px]",
        active && "border-[#FFDC50]",
        item.unlocked && "cursor-pointer"
      )}
      onClick={() => {
        if (item.unlocked) onClick(item);
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[5px]">
          <div className="flex items-center">
            <img
              src={token0.icon}
              alt={token0.name}
              width={26}
              height={26}
              className="rounded-full"
            />
            <img
              src={token1.icon}
              alt={token1.name}
              width={26}
              height={26}
              className="rounded-full ml-[-8px]"
            />
          </div>
          <div>
            <div className="font-semibold">
              {token0.symbol}-{token1.symbol}
            </div>
          </div>
        </div>
        <div className="flex justify-end items-center gap-[4px]">
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
            <div className="font-semibold">
              in{" "}
              {Math.ceil((item.ending_timestamp - Date.now() / 1000) / 86400)}{" "}
              days
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-[10px]">
        <div className="font-semibold">
          {balanceFormated(item.amount0, 5)}/{balanceFormated(item.amount1, 5)}
        </div>
        <div className="text-center rounded-[6px] bg-[#7587FF] w-[50px] leading-[24px] text-white text-[14px] font-semibold md:text-[12px]">
          x{item.multiplier}
        </div>
      </div>
    </div>
  );
};

export default Item;
