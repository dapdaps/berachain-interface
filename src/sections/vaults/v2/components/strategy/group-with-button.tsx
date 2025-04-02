import clsx from 'clsx';
import Loading from '@/components/loading';
import StrategyButton from '@/sections/vaults/v2/components/strategy/button';

const StrategyGroupWithButton = (props: any) => {
  const { className, loading, children, buttonText, ...restButtonProps } = props;

  return (
    <div
      className={clsx(
        'h-[40px] flex justify-between items-center flex-shrink-0 text-black font-Montserrat text-[16px] font-medium leading-[150%] rounded-[10px] border border-[#D9D9D9] bg-[#FFF] pl-[11px]',
        className
      )}
    >
      <div className="flex-1 w-0 overflow-hidden whitespace-nowrap flex items-center gap-[8px]">
        {children}
      </div>
      <StrategyButton
        {...restButtonProps}
        className={clsx("shrink-0", restButtonProps?.className)}
      >
        {buttonText}
      </StrategyButton>
    </div>
  );
};

export default StrategyGroupWithButton;
