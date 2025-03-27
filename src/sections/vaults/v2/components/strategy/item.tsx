import clsx from 'clsx';
import StrategyTitle from '@/sections/vaults/v2/components/strategy/title';

const StrategyItem = (props: any) => {
  const { className, contentClassName, children, title, no, isLine = true } = props;

  return (
    <div className={clsx("relative pb-[40px]", className)}>
      <StrategyTitle no={no}>
        {title}
      </StrategyTitle>
      <div className={clsx("mt-[19px] grid grid-cols-1 gap-[16px] pl-[40px]", contentClassName)}>
        {children}
      </div>
      {
        isLine && (
          <div className="absolute left-[15px] top-[30px] w-[1px] h-[calc(100%_-_30px)] border-l border-dashed border-l-black"></div>
        )
      }
    </div>
  );
};

export default StrategyItem;
