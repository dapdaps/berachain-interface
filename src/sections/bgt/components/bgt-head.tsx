import { formatValueDecimal } from "@/utils/balance";
import useCustomAccount from '@/hooks/use-account';
import { useMemo } from 'react';
import { numberFormatter } from "@/utils/number-formatter";

const BgtHead = (props: any) => {
  const { bgtData, style, className } = props;

  const { account } = useCustomAccount();

  const count = useMemo(() => {
    if (!account) return '0';
    return bgtData?.count;
  }, [account, bgtData]);

  return (
    <div className="relative mb-[20px]">
      <div className='absolute -left-[16px] top-[50%] translate-y-[-50%] w-[66px]'>
        <img className="w-full" src="/images/icon-coin.svg" alt="coin" />
      </div>
      <div className="rounded-[30px] bg-[#DAA56B] shadow-[1px_1px_0_0_#77481E] p-[6px]">
        <div className="bg-[#A6703D] font-CherryBomb whitespace-nowrap text-[32px] font-[400] items-center rounded-[26px] border border-[#924E00] pl-[68px] pr-[12px] py-[6px] leading-[0.9]">
          {numberFormatter(count, 3, true)} BGT
        </div>
      </div>
    </div>

  );
};

export default BgtHead;
