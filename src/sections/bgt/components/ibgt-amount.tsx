import Popover, { PopoverPlacement } from "@/components/popover";
import { numberFormatter } from "@/utils/number-formatter";
import clsx from "clsx";
import { memo } from "react";

export default memo(function IbgtAmount({
  className,
  usdAmount,
  amount
}: {
  className: string
}) {
  return (
    <Popover
      placement={PopoverPlacement.BottomLeft}
      content={
        <div className='relative pt-[19px] px-[19px] pb-[23px] w-[200px] h-[110px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,0,0,0.25)]'>
          <div className='flex flex-col gap-[13px]'>
            <div className='text-[#3D405A] font-Montserrat text-[14px] font-medium'>
              Amount
            </div>
            <div className='text-black font-Montserrat text-[20px] font-semibold leading-[90%]'>
              {numberFormatter(amount, 3, true)}{' '}iBGT
            </div>
          </div>
        </div>
      }
    >
      <div className={clsx('underline cursor-pointer', className)}>
        {numberFormatter(usdAmount, 2, true, {
          prefix: "$"
        })}
      </div>
    </Popover>
  )
})