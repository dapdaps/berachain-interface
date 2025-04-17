import clsx from 'clsx';

const Incentives = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx("", className)}>
      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
        Incentives
      </div>
      <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium leading-normal mt-[7px]">
        Breakdown of incentives given to user for boosting this validator
      </div>
      <div className="mt-[24px] grid grid-cols-3 gap-x-[13px] gap-y-[16px]">
        <div className="h-[124px] rounded-[10px] bg-[rgba(0,0,0,0.06)] p-[16px]">
          <div className="flex items-center gap-[10px]">
            <img
              src="" 
              alt=""
              className="shrink-0 w-[36px] h-[36px] rounded-full object-center object-contain"
            />
            <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
              HENLO
            </div>
          </div>
          <div className="mt-[16px] flex justify-between items-start">
            <LabelValue label="Reward Rate">
              <div className="">
                16.61M
              </div>
              <div className="text-[#3D405A] font-[500] text-[14px]">
                ($3.82K)
              </div>
            </LabelValue>
            <LabelValue label="Rate Per BGT Emitted">
              <div className="">
                16.61M
              </div>
              <div className="text-[#3D405A] font-[500] text-[14px]">
                ($3.82K)
              </div>
            </LabelValue>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Incentives;

const LabelValue = (props: any) => {
  const { className, label, children, labelClassName, valueClassName } = props;
  
  return (
    <div className={clsx("text-[#3D405A] font-Montserrat text-[14px] font-medium leading-normal", className)}>
      <div className={clsx('', labelClassName)}>
        {label}
      </div>
      <div className={clsx("text-black text-[16px] font-[600] flex items-center gap-[4px]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};
