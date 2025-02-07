import clsx from 'clsx';

const StepVertical = (props: any) => {
  const { className, list } = props;

  return (
    <div className={clsx('flex flex-col items-start gap-[56px] pb-[30px]', className)}>
      {
        list.map((item: any, idx: number) => (
          <>
            <div key={idx} className="relative w-full flex justify-between items-start">
              <div
                className="relative flex items-center gap-[8px] text-black text-[18px] font-Montserrat font-[600] leading-[90%] shrink-0"
              >
                <img src={item.icon} alt="" className="w-[22px] h-[22px] rounded-full shrink-0" />
                <div className="">
                  {item.label}
                </div>
                {
                  idx < list.length - 1 && (
                    <div className={clsx('absolute flex-1 w-[1px] h-[50px] left-[10.5px] top-[25px] border-l border-l-black', idx === 0 ? 'border-dashed' : '')}></div>
                  )
                }
              </div>
              <div className="absolute right-0 flex flex-col items-end gap-[5px] text-black text-[16px] font-[600] leading-[90%] text-right whitespace-nowrap translate-y-[5px]">
                <div className="">
                  {item.value}
                </div>
                <div className="text-[#3D405A] font-[500] text-[0.75em] leading-normal">
                  {item.status}
                </div>
              </div>
            </div>
          </>
        ))
      }
    </div>
  );
};

export default StepVertical;
