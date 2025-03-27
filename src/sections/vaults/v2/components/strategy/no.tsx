import clsx from 'clsx';

const StrategyNo = (props: any) => {
  const { className, children } = props;

  return (
    <div
      className={clsx(
        "w-[30px] h-[30px] flex-shrink-0 bg-[#FFDC50] border border-black flex justify-center items-center rounded-full",
        "text-black text-center font-Montserrat text-[18px] font-semibold leading-[90%]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default StrategyNo;
