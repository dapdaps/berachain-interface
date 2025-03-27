import clsx from 'clsx';
import Loading from '@/components/loading';

const StrategyButton = (props: any) => {
  const { className, loading, children, ...restProps } = props;

  return (
    <button
      type="button"
      className={clsx(
        "flex justify-center items-center gap-[10px] h-[40px] flex-shrink-0 rounded-[10px] border border-black bg-[#FFDC50] text-black text-center font-Montserrat text-[16px] font-normal leading-[150%] px-[15px]",
        className
      )}
      {...restProps}
    >
      {
        loading && (
          <Loading size={16} />
        )
      }
      <div className="">
        {children}
      </div>
    </button>
  );
};

export default StrategyButton;
