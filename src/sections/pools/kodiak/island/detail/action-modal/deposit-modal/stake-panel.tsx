import { balanceFormated } from "@/utils/balance";
import Big from "big.js";
import Button from "@/components/button";
import useStake from "../../../hooks/use-stake";

export default function StakePanel({ data, amount, lockData, onSuccess }: any) {
  const { loading, onStake } = useStake({
    farmContract: data.farmAddress,
    data,
    amount,
    days: lockData.days,
    token: { symbol: data.symbol },
    onSuccess
  });
  return (
    <>
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-start justify-between mt-[6px]">
          <div>
            <div className="font-semibold text-[16px]">
              {balanceFormated(amount, 10)}
            </div>
            <div className="text-[14px] font-medium">
              (${" "}
              {amount && data.price
                ? balanceFormated(Big(amount).mul(data.price).toString(), 5)
                : "-"}{" "}
              )
            </div>
          </div>
          <div className="font-semibold text-[16px]">{data.symbol}</div>
        </div>
      </div>
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px] text-[14px] font-medium text-[#3D405A]">
        <div className="flex items-center justify-between mt-[6px]">
          <div>Lock period</div>
          <div>{lockData.days} days</div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div>APR</div>
          <div>{Number(data?.apr || 0).toFixed(2)}%</div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div>Multiplier</div>
          <div>x{lockData.multiplier}</div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div>Est. received</div>
          <div>-</div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={onStake}
        loading={loading}
      >
        Stake
      </Button>
    </>
  );
}
