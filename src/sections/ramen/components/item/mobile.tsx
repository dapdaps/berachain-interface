import clsx from 'clsx';
import Avatar from '@/sections/ramen/components/item/avatar';
import LabelItem from '@/sections/ramen/detail/components/label-item';
import { numberFormatter } from '@/utils/number-formatter';
import TotalRaised from '@/sections/ramen/components/item/total-raised';
import SalePrice from '@/sections/ramen/components/item/sale-price';
import * as dateFns from 'date-fns';

const ItemMobile = (props: any) => {
  const { className, project, beraPrice } = props;

  return (
    <div className={clsx('w-full flex-1', className)}>
      <div className="w-full flex justify-between items-center gap-[10px]">
        <Avatar project={project} className="flex-1 w-0 !gap-[10px]" imgClassName="!w-[50px] !h-[50px]" />
        <LabelItem className="shrink-0 items-end gap-[4px]" valueClassName="text-[16px] font-[500]" label="Participants">
          {numberFormatter(project?.participants, 2, true)}
        </LabelItem>
      </div>
      <div className="mt-[18px] grid grid-cols-2 gap-y-[20px]">
        <LabelItem className="shrink-0 items-start gap-[4px]" valueClassName="text-[16px] font-[500]" label="Total Raised">
          <TotalRaised project={project} beraPrice={beraPrice} className="gap-[6px] leading-[100%]" />
        </LabelItem>
        <LabelItem className="shrink-0 items-start gap-[4px] pl-[50px]" valueClassName="text-[16px] font-[500]" label="Sale Price">
          <SalePrice project={project} beraPrice={beraPrice} className="gap-[6px] leading-[100%]" />
        </LabelItem>
        <LabelItem className="shrink-0 items-start gap-[4px]" valueClassName="text-[16px] font-[500]" label="ATH ROI">
          Pending
        </LabelItem>
        <LabelItem className="shrink-0 items-start gap-[4px] pl-[50px]" valueClassName="text-[16px] font-[500]" label="Date Ended">
          {project?.date_ended ? dateFns.format(project?.date_ended, "MM/dd/yyyy") : '-'}
        </LabelItem>
      </div>
      <button
        type="button"
        className="mt-[20px] bg-[#FFDC50] border border-black rounded-[10px] h-[40px] w-full flex justify-center items-center gap-[10px] text-black text-[16px] font-[600] font-Montserrat"
      >
        Details
      </button>
    </div>
  );
};

export default ItemMobile;
