import clsx from 'clsx';

const LabelItem = (props: any) => {
  const { className, label, children, valueClassName } = props;

  return (
    <div className={clsx('text-black text-[18px] font-[600] font-Montserrat leading-[90%] flex flex-col gap-[12px]', className)}>
      <div className="text-[#3D405A] font-[500] text-[14px] overflow-hidden text-ellipsis">
        {label}
      </div>
      <div className={clsx('overflow-hidden text-ellipsis whitespace-nowrap', valueClassName)}>
        {children}
      </div>
    </div>
  );
};

export default LabelItem;
