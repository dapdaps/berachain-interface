import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import useIsMobile from "@/hooks/use-isMobile";
import { numberFormatter } from "@/utils/number-formatter";

const SimpleTotal = ({ data }: any) => {
  return (
    <div className="flex items-center justify-between text-[16px]">
      <div className="font-semibold">My Deposits</div>
      <div className="font-bold">{numberFormatter(data.balanceUsd, 2, true, { isShort: true, round: 0, prefix: "$" })}</div>
    </div>
  );
};

const Total = ({ data, symbol }: any) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="font-semibold text-[16px]">My Deposits</div>
        <div className="font-bold text-[16px] mt-[8px]">
          {numberFormatter(
            Big(data.balanceUsd).add(data.locked.amountUsd).add(data.lockedBault.receiveLpAmountUsd || 0).toString(),
            2,
            true,
            { isShort: true, round: 0, prefix: "$" }
          )}
        </div>
        <div className="font-medium text-[12px] mt-[4px]">
          {numberFormatter(
            Big(data.balance).add(data.locked.amount).add(data.lockedBault.receiveLpAmount || 0).toString(),
            6,
            true,
            { isShort: true, round: 0 }
          )}{" "}
          {symbol}
        </div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Available</div>
        <div className="font-bold text-[16px] mt-[8px]">
          {numberFormatter(data.balanceUsd, 2, true, { isShort: true, round: 0, prefix: "$" })}{" "}
        </div>
        <div className="font-medium text-[12px] mt-[4px]">
          {numberFormatter(data.balance, 6, true, { isShort: true, round: 0 })} {symbol}
        </div>
      </div>
      <div>
        <div className="font-semibold text-[16px]">Locked</div>
        <div className="font-bold text-[16px] mt-[8px]">
          {numberFormatter(data.locked.amountUsd, 2, true, { isShort: true, round: 0, prefix: "$" })}
        </div>
        <div className="font-medium text-[12px] mt-[3px]">
          {numberFormatter(data.locked.amount, 6, true, { isShort: true, round: 0 })} {symbol}
        </div>
      </div>
      {
        Big(data.lockedBault.receiveLpAmount || 0).gt(0) && (
          <div>
            <div className="font-semibold text-[16px]">Bault</div>
            <div className="font-bold text-[16px] mt-[8px]">
              {numberFormatter(data.lockedBault.receiveLpAmountUsd, 2, true, { isShort: true, round: 0, prefix: "$" })}
            </div>
            <div className="font-medium text-[12px] mt-[3px]">
              {numberFormatter(data.lockedBault.receiveLpAmount, 6, true, { isShort: true, round: 0 })} {symbol}
            </div>
          </div>
        )
      }
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
