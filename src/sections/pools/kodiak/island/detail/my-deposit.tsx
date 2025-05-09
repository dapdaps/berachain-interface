import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";

const SimpleTotal = ({ data }: any) => {
  return (
    <div className="flex items-center justify-between text-[16px]">
      <div className="font-semibold">My Deposits</div>
      <div className="font-bold">${balanceFormated(data.balanceUsd, 2)}</div>
    </div>
  );
};

const Total = ({ data, symbol }: any) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-[16px]">My Deposits</div>
        <div className="font-bold text-[16px] mt-[8px]">
          $
          {balanceFormated(
            Big(data.balanceUsd).add(data.locked.amountUsd).toString(),
            2
          )}
        </div>
        <div className="font-medium text-[12px] mt-[4px]">
          {balanceFormated(
            Big(data.balance).add(data.locked.amount).toString(),
            2
          )}{" "}
          {symbol}
        </div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Available</div>
        <div className="font-bold text-[16px] mt-[8px]">
          ${balanceFormated(data.balanceUsd, 2)}{" "}
        </div>
        <div className="font-medium text-[12px] mt-[4px]">
          {balanceFormated(data.balance, 2)} {symbol}
        </div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Locked</div>
        <div className="font-bold text-[16px] mt-[8px]">
          ${balanceFormated(data.locked.amountUsd, 2)}
        </div>
        <div className="font-medium text-[12px] mt-[3px]">
          {balanceFormated(data.locked.amount, 2)} {symbol}
        </div>
      </div>
    </div>
  );
};

export default function Mydeposit({ info = {}, token0, token1, symbol }: any) {
  const isMobile = useIsMobile();

  return (
    <div
      className={clsx(
        "rounded-[10px] bg-black/5 px-[16px] py-[20px] w-[440px]",
        "md:w-full md:mt-[12px] md:rounded-[20px] md:bg-[#FFFDEB] md:border md:border-black md:p-[10px]"
      )}
    >
      {info.locked && !isMobile ? (
        <Total data={info} symbol={symbol} />
      ) : (
        <SimpleTotal data={info} />
      )}

      <div className="flex items-center justify-between mt-[18px]">
        <div className="flex items-center gap-[9px]">
          <img
            src={token0.icon}
            alt={token0.name}
            width={26}
            height={26}
            className="rounded-full"
          />
          <div className="font-semibold text-[14px]">{token0.symbol}</div>
        </div>
        <div className="font-semibold text-[14px]">
          {balanceFormated(info.token0Amount, 4)}
        </div>
      </div>
      <div className="flex items-center justify-between mt-[10px]">
        <div className="flex items-center gap-[9px]">
          <img
            src={token1.icon}
            alt={token1.name}
            width={26}
            height={26}
            className="rounded-full"
          />
          <div className="font-semibold text-[14px]">{token1.symbol}</div>
        </div>
        <div className="font-semibold text-[14px]">
          {balanceFormated(info.token1Amount, 4)}
        </div>
      </div>
    </div>
  );
}
