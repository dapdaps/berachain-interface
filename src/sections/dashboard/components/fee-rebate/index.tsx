"use client";

import clsx from "clsx";

const FeeRebate = (props: any) => {
  const { className, value } = props;

  return (
    <button
      type="button"
      className={clsx('whitespace-nowrap h-[36px] leading-[34px] text-black text-[16px] font-[400] font-CherryBomb flex items-stretch gap-[0]', className)}
    >
      <div className="flex-1 bg-[#FF888A] border border-black border-r-0 rounded-l-[10px] pr-[2px] pl-[10px]">{value}</div>
      <img src="/images/dashboard/rebate-coupon-bg.svg" alt="" className="shrink-0 h-full" />
      <div className="flex-1 bg-[#FF888A] border border-black border-l-0 rounded-r-[10px] pl-[2px] pr-[8px]">Fee Rebate</div>
    </button>
  );
};

export default FeeRebate;
