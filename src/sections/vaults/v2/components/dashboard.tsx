import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import { numberFormatter } from '@/utils/number-formatter';
import { ORDER_DIRECTION, ORDER_KEYS } from '@/sections/vaults/v2/config';

const Dashboard = (props: any) => {
  const { className } = props;

  const {
    totalUserStakeUsd,
    totalUserVaultsCount,
    totalUserRewardUsd,
    toggleListOrder,
  } = useVaultsV2Context();

  return (
    <div className={clsx("text-[20px] text-black leading-[90%] font-[600] font-Montserrat bg-[#FFDC50] rounded-[10px] p-[20px_24px_23px_31px] md:p-[16px_19px_17px_9px] flex justify-between items-start", className)}>
      <div className="flex items-start gap-[100px] md:gap-[30px]">
        <Item
          label="You Invested"
          value={numberFormatter(totalUserStakeUsd, 2, true, { prefix: "$" })}
        />
        <Item
          label="Your Rewards"
          value={numberFormatter(totalUserRewardUsd, 2, true, { prefix: "$" })}
        />
      </div>
      <Item
        label="Your Vaults"
        value={numberFormatter(totalUserVaultsCount, 0, true)}
        valueClassName="underline cursor-pointer"
        className="lg:items-end"
        onClick={() => {
          toggleListOrder(ORDER_KEYS.YOURS, ORDER_DIRECTION.DESC);
        }}
      />
    </div>
  );
};

export default Dashboard;

const Item = (props: any) => {
  const { className, label, value, valueClassName, onClick } = props;

  return (
    <div className={clsx("flex flex-col gap-[12px]", className)}>
      <div className="text-[#3D405A] text-[14px] font-[500] whitespace-nowrap">
        {label}
      </div>
      <div className={clsx("", valueClassName)} onClick={onClick}>
        {value}
      </div>
    </div>
  );
};
