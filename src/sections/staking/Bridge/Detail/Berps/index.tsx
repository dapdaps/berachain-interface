import LazyImage from '@/components/layz-image';
import Popover, { PopoverPlacement, PopoverTrigger } from '@/components/popover';
import React, { forwardRef } from 'react';
import { numberFormatter } from '@/utils/number-formatter';
import WithdrawQueue from '@/sections/staking/Bridge/Detail/Berps/Queue';

const DetailBerps = forwardRef<any, any>((props, ref) => {
  const { data } = props;

  const { depositToken, withdrawToken } = data || {};

  return (
    <div className="flex-1 pr-[24px] pl-[13px] py-[24px] rounded-[10px] bg-black/[0.06]">
      <div className="grid grid-cols-2 gap-[15px]">
        <Item
          label={`Total ${depositToken?.symbol} Value`}
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.completeBalanceOfAssets, 2, true)}
              </span>
            </>
          )}
        />
        <Item
          label="Est. Earnings"
          value={(
            <>
              <LazyImage src={depositToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.estimatedEarnings, 2, true)}
              </span>
            </>
          )}
          tooltip={`Estimated earnings = ${withdrawToken?.symbol} balance (including cooldown amount) market value + total ${depositToken?.symbol} withdrawn - total ${depositToken?.symbol} deposited`}
        />
        <Item
          label={`${withdrawToken?.symbol} Balance`}
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.completeBalanceOf, 2, true)}
              </span>
            </>
          )}
          tooltip={`Total ${withdrawToken?.symbol} including the amount in cooldown`}
        />
        <Item
          label="Cooldown"
          value={(
            <>
              <LazyImage src={withdrawToken?.icon} width={20} height={20} />
              <span>
                {numberFormatter(data?.totalSharesBeingWithdrawn, 2, true)}
              </span>
            </>
          )}
          tooltip={`This amount of ${withdrawToken?.symbol} is non-transferable until the withdrawal is processed. You won't be able to transfer it during this time.`}
        />
      </div>
      <WithdrawQueue ref={ref} {...props} />
    </div>
  );
});

export default DetailBerps;

const Item = (props: any) => {
  const { label, value, tooltip } = props;

  return (
    <div className="rounded-[10px] bg-[#FFDC50] py-[15px] px-[20px]">
      <Popover
        content={tooltip ? (
          <div className="rounded-[20px] border border-black bg-[#FFFDEB] shadow-shadow1 p-[5px_10px] max-w-[300px]">{tooltip}</div>
        ) : void 0}
        trigger={PopoverTrigger.Hover}
        placement={PopoverPlacement.TopLeft}
      >
        <div className={`text-[#3D405A] font-Montserrat text-[14px] font-medium ${tooltip ? 'underline decoration-dashed cursor-pointer' : ''}`}>
          {label}
        </div>
      </Popover>
      <div className="flex items-center gap-[10px] mt-[5px] text-black font-Montserrat text-[20px] font-semibold leading-[90%] whitespace-nowrap">
        {value}
      </div>
    </div>
  );
};
