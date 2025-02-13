import Range from "@/components/range";
import Button from "@/components/button";
import { balanceFormated } from "@/utils/balance";
import { Contract } from "ethers";
import farmAbi from "../../../abi/farm";
import { useState, useMemo, useEffect, useCallback } from "react";
import useCustomAccount from "@/hooks/use-account";
import Big from "big.js";

export default function LockTimePanel({ data, info, received, onClick }: any) {
  const [days, setDays] = useState(30);
  const range = useMemo(() => Math.ceil((days / 30) * 100), [days]);
  const [multiplier, setMultiplier] = useState("3.00");
  const { provider } = useCustomAccount();

  const getMultiplier = useCallback(
    async (time: number) => {
      const farmContract = await new Contract(
        data.farmAddress,
        farmAbi,
        provider
      );
      const secs = time * 86400;
      const multiplierRes = await farmContract.lockMultiplier(secs);
      setMultiplier(Big(multiplierRes.toString()).div(1e18).toFixed(2));
    },
    [data]
  );

  useEffect(() => {
    getMultiplier(days);
  }, [days]);

  return (
    <>
      <div className="flex items-center justify-between mt-[16px]">
        <div className="text-[14px] font-medium	text-[#3D405A]">
          Select lock-up period
        </div>
        <div className="font-semibold text-[16px]">{days} days</div>
      </div>
      <Range
        value={range}
        onChange={(e: any) => {
          setDays(Math.ceil((e.target.value * 30) / 100));
        }}
      />
      <div className="text-[14px] font-medium	text-[#3D405A] mt-[16px]">
        Estimated award by the end of the lock-up period
      </div>
      <div className="mt-[20px] rounded-[12px] border border-[#373A53] p-[12px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[4px]">
            <img
              src={info.rewardToken.icon}
              alt={info.rewardToken.symbol}
              width={26}
              height={26}
              className="rounded-full"
            />
            <div className="text-[14px] font-medium">
              {info.rewardToken.symbol}
            </div>
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            <span className="text-[16px] font-semibold mr-[7px]">-</span>
            {days > 0 ? <span>per {days} days</span> : <span>per year</span>}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Stake amount
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            {" "}
            {balanceFormated(received, 6)} {data.symbol}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">
            Multiplier
          </div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            x{multiplier}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[6px]">
          <div className="text-[14px] font-medium	text-[#3D405A]">APR</div>
          <div className="text-[14px] font-medium	text-[#3D405A]">
            {" "}
            {Number(data?.apr || 0).toFixed(2)}%
          </div>
        </div>
      </div>
      <Button
        type="primary"
        className="w-full h-[46px] mt-[16px]"
        onClick={() => {
          onClick({
            days,
            multiplier
          });
        }}
      >
        Confirm
      </Button>
    </>
  );
}
