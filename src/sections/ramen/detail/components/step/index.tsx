import clsx from 'clsx';

const Step = (props: any) => {
  const { className, list } = props;

  return (
    <div className={clsx('flex justify-between items-center gap-[10px] pb-[24px]', className)}>
      {
        list.map((item: any, idx: number) => (
          <>
            <div
              key={idx}
              className="relative flex items-center gap-[8px] text-black text-[18px] font-Montserrat font-[600] leading-[90%] shrink-0"
            >
              <img src={item.icon} alt="" className="w-[22px] h-[22px] rounded-full shrink-0" />
              <div className="">
                {item.label}
              </div>
              <div className="absolute left-0 -bottom-[24px] text-[#3D405A] text-[14px] font-[500] leading-normal whitespace-nowrap">
                {item.date}
              </div>
            </div>
            {
              idx < list.length - 1 && (
                <div className="flex-1 h-[1px] bg-black"></div>
              )
            }
          </>
        ))
      }
    </div>
  );
};

export default Step;
