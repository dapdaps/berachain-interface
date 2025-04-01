import clsx from 'clsx';
import StrategyNo from '@/sections/vaults/v2/components/strategy/no';

const StrategyTitle = (props: any) => {
  const { className, children, no } = props;

  return (
    <div
      className={clsx(
        "text-black font-montserrat text-[18px] font-semibold leading-[90%] flex items-center gap-[10px]",
        className
      )}
    >
      <StrategyNo>{no}</StrategyNo>
      <div className="">{children}</div>
    </div>
  );
};

export default StrategyTitle;
