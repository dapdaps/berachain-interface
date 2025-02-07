import clsx from 'clsx';

const Card = (props: any) => {
  const { className, title, children, prefix } = props;

  return (
    <div className={clsx('bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[22px_20px_12px] text-black text-[18px] font-[600] font-Montserrat leading-[90%]', className)}>
      {prefix}
      <div className="border-b border-b-[rgba(0,_0,_0,_0.10)] text-black text-[18px] font-[600] font-Montserrat leading-[90%] pb-[11px]">
        {title}
      </div>
      {children}
    </div>
  );
};

export default Card;
