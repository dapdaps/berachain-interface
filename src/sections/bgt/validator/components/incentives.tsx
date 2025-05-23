import clsx from 'clsx';
import Big from 'big.js';
import { numberFormatter } from '@/utils/number-formatter';
import Skeleton from 'react-loading-skeleton';

const Incentives = (props: any) => {
  const { className, list = [], loading } = props;

  return (
    <div className={clsx("", className)}>
      <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
        Incentives
      </div>
      <div className="text-[#3D405A] font-Montserrat text-[14px] md:text-[12px] font-medium leading-normal mt-[7px]">
        Breakdown of incentives given to user for boosting this validator
      </div>
      <div className="mt-[24px] md:mt-[8px] grid grid-cols-3 md:grid-cols-2 gap-x-[13px] md:gap-x-[10px] gap-y-[16px] md:gap-y-[12px]">
        {
          loading ? (
            <>
              <Skeleton width="100%" height={124} borderRadius={10} />
              <Skeleton width="100%" height={124} borderRadius={10} />
              <Skeleton width="100%" height={124} borderRadius={10} />
            </>
          ) : list.map((item: any, index: number) => (
            <div
              key={index}
              className="h-[124px] md:h-[142px] rounded-[10px] bg-[rgba(0,0,0,0.06)] p-[16px] md:p-[12px_9px]"
            >
              <div className="flex items-center gap-[10px] md:gap-[5px]">
                <a
                  href={item.link}
                  target="_blank"
                  rel="nofollow"
                  className="shrink-0 block w-[36px] md:w-[24px] h-[36px] md:h-[24px] rounded-full bg-center bg-no-repeat bg-contain"
                  style={{
                    backgroundImage: `url("${item.icon}")`,
                  }}
                />
                <a href={item.link} target="_blank" rel="nofollow" className="flex-1 w-0 line-clamp-1 text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
                  {item.symbol}
                </a>
              </div>
              <div className="mt-[16px] md:mt-[10px] flex justify-between md:justify-center items-start md:flex-col md:gap-[10px]">
                <LabelValue label="Remaining">
                  <div className="">
                    {numberFormatter(item.remainingAmount, 2, true, { isShort: true, isShortUppercase: true })}
                  </div>
                  <div className="text-[#3D405A] font-[500] text-[14px]">
                    ({numberFormatter(item.remainingAmountUsd, 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })})
                  </div>
                </LabelValue>
                <LabelValue label="Rate Per BGT Emitted">
                  <div className="">
                    {numberFormatter(item.ratePerBGTEmitted, 2, true, { isShort: true, isShortUppercase: true })}
                  </div>
                  <div className="text-[#3D405A] font-[500] text-[14px]">
                    ({numberFormatter(Big(item.ratePerBGTEmitted || 0).times(item.price || 0), 2, true, { isShort: true, isShortUppercase: true, prefix: '$' })})
                  </div>
                </LabelValue>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Incentives;

const LabelValue = (props: any) => {
  const { className, label, children, labelClassName, valueClassName } = props;
  
  return (
    <div className={clsx("text-[#3D405A] font-Montserrat text-[14px] md:text-[12px] font-medium leading-normal", className)}>
      <div className={clsx('', labelClassName)}>
        {label}
      </div>
      <div className={clsx("text-black text-[16px] font-[600] md:text-[12px] flex items-center gap-[4px]", valueClassName)}>
        {children}
      </div>
    </div>
  );
};
