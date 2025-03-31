import clsx from 'clsx';
import Range from '@/components/range';

const ActionRangeDays = (props: any) => {
  const { className, dappParams, setDappParams } = props;

  return (
    <>
      <div className={clsx("flex items-center justify-between", className)}>
        <div className="text-[14px] font-medium	text-[#3D405A]">
          Select lock-up period
        </div>
        <div className="font-semibold text-[16px]">
          {dappParams?.days || 0} days
        </div>
      </div>
      <Range
        value={Math.ceil(((dappParams?.days || 0) / 30) * 100)}
        onChange={(e: any) => {
          setDappParams({ days: Math.ceil((e.target.value / 100) * 30) });
        }}
      />
    </>
  )
};

export default ActionRangeDays;
