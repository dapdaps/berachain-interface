import clsx from 'clsx';
import { E_LAUNCH_STATUS, LAUNCH_STATUS } from '@/sections/ramen/config';
import LabelItem from '@/sections/ramen/detail/components/label-item';
import Big from 'big.js';
import { bera } from '@/configs/tokens/bera';
import { numberFormatter } from '@/utils/number-formatter';

const LaunchCard = (props: any) => {
  const { className, project } = props;

  return (
    <div className={clsx('relative bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[8px_8px_16px] text-black text-[20px] font-[700] leading-[90%] font-Montserrat', className)}>
      <div className="w-full relative">
        <img src={project?.cover_image_url} alt="" className="w-full h-[200px] rounded-[10px] object-cover" />
        <LaunchStatus value={0} className="absolute right-[14px] top-[10px]" />
        <LaunchCountdown type="end" className="absolute right-0 -bottom-[16px]" />
        <div className="absolute left-0 bottom-[-75px] w-full flex items-end gap-[9px]">
          <div className="w-[88px] h-[88px] rounded-full border border-black overflow-hidden">
            <img src={project?.token_icon_url} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col gap-[8px] text-black text-[18px] font-Montserrat font-[600] leading-[90%] pb-[9px]">
            <div className="">
              {project?.token_name}
            </div>
            <div className="text-[14px] text-[#646464]">
              {project?.token_symbol}
            </div>
          </div>
          <LabelItem className="ml-auto !gap-[7px] pb-[9px]" label="Sale Price">
            {numberFormatter(Big(project?.token_price_in_bera || 0).div(10 ** bera.bera.decimals), 4, true)} {bera.bera.symbol}
          </LabelItem>
        </div>
      </div>
      <div className="mt-[86px] grid grid-cols-2">
        <LabelItem className="!gap-[7px]" label="Raise Amount">
          {numberFormatter(Big(project?.raised_amount || 0).div(10 ** bera.bera.decimals), 4, true)} {bera.bera.symbol}
        </LabelItem>
        <LabelItem className="!gap-[7px] items-end" label="Launch Type">
          {!!project?.price_discovery_id && 'Price Discovery Mode' }
          {!!project?.private_sale_id && 'Fixed-Price Sale' }
        </LabelItem>
      </div>
      <button
        type="button"
        className={clsx('w-full h-[46px] mt-[15px] rounded-[10px] hover:scale-[0.99] hover:translate-y-[1px] transition-all duration-150 flex justify-center items-center border border-black bg-[#F0EEDD] text-black text-[16px] font-[600] font-Montserrat', project?.status === E_LAUNCH_STATUS.LIVE ? '!bg-[#FFDC50]' : '')}
      >
        {project?.status === E_LAUNCH_STATUS.LIVE ? 'Participate Now' : 'Preview'}
      </button>
    </div>
  );
};

export default LaunchCard;

export const LaunchStatus = (props: any) => {
  const { className, value } = props;

  const status = LAUNCH_STATUS[value as E_LAUNCH_STATUS];

  return (
    <div
      className={clsx('h-[32px] rounded-[16px] flex justify-center items-center px-[13px] text-black text-[14px] font-Montserrat font-[600] leading-[100%]', className)}
      style={{
        background: status?.color,
      }}
    >
      {status?.label}
    </div>
  );
};

export const LaunchCountdown = (props: any) => {
  const {
    className,
    // start | end
    type,
    datetime,
  } = props;

  return (
    <div className={clsx('h-[32px] bg-[#FFFDEB] border border-black rounded-[16px] flex justify-center items-center gap-[13px] pl-[20px] pr-[30px] text-black text-[14px] font-Montserrat font-[600] leading-[100%]', className)}>
      <div className="">
        {type?.slice?.(0, 1)?.toUpperCase?.() + type?.slice?.(1)}s in
      </div>
      <div className="text-[#CE494D]">
        0d 0h 46m 02s
      </div>
    </div>
  );
};
