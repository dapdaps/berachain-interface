import { formatValueDecimal } from "@/utils/balance";
import useCustomAccount from '@/hooks/use-account';
import { useMemo } from 'react';
import { numberFormatter } from "@/utils/number-formatter";

const IbgtHead = (props: any) => {
  const { style, className, ibgtData, innerStyle, innerClassName, valueStyle, valueClassName } = props;

  const { account } = useCustomAccount();

  const count = useMemo(() => {
    if (!account) return '0';
    return ibgtData?.count;
  }, [account, ibgtData]);

  return (
    <div className="relative mb-[20px]">
      <div className='absolute -left-[16px] top-[50%] translate-y-[-50%] w-[66px]'>
        <img className="w-full" src="/images/icon-ibgt.svg" alt="icon-ibgt" />
      </div>
      <div className="rounded-[30px] bg-[#DAA56B] shadow-[1px_1px_0_0_#77481E] p-[6px]">
        <div className="bg-[#A6703D] font-CherryBomb whitespace-nowrap text-[32px] font-[400] items-center rounded-[26px] border border-[#924E00] pl-[68px] pr-[12px] py-[6px] leading-[0.9]">
          {numberFormatter(count, 3, true)} iBGT
        </div>
      </div>
    </div>
  );
};

export default IbgtHead;
