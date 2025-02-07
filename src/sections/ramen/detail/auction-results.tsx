import clsx from 'clsx';
import LabelItem from '@/sections/ramen/detail/components/label-item';
import { numberFormatter } from '@/utils/number-formatter';

const AuctionResults = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('mt-[16px]', className)}>
      <div className="grid grid-cols-2 gap-[30px]">
        <LabelItem label="Final FDV">
          {numberFormatter('1000000000', 2, true)} BERA
        </LabelItem>
        <LabelItem label="Avg. Spend Amount">
          {numberFormatter('100000', 2, true)} BERA
        </LabelItem>
        <LabelItem label="Total Riased">
          {numberFormatter('100000', 2, true)} BERA
        </LabelItem>
        <LabelItem label="Final Price per Token">
          <div className="flex items-end gap-[8px] w-full">
            <div className="flex-1 w-0 overflow-hidden text-ellipsis">{numberFormatter('10000', 2, true)} BERA</div>
            <div className="text-[#7EA82B] text-[12px] leading-[100%] shrink-0">
              +900%
            </div>
          </div>
        </LabelItem>
      </div>
    </div>
  );
};

export default AuctionResults;
