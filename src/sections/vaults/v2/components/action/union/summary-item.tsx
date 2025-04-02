import clsx from "clsx";

const ActionSummaryItem = (props: any) => {
  const { className, label, children, valueClassName } = props;

  return (
    <div className={clsx('flex flex-col gap-[12px] text-black font-Montserrat text-[20px] font-semibold leading-[90%]', className)}>
      <div className="text-[#3D405A] text-[14px] font-[500]">
        {label}
      </div>
      <div className={valueClassName}>
        {children}
      </div>
    </div>
  );
};

export default ActionSummaryItem;
