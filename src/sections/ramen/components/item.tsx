import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';
import * as dateFns from 'date-fns';
import { useRouter } from 'next/navigation';

const Item = (props: any) => {
  const { className, project } = props;

  const router = useRouter();

  const onClick = () => {
    if (!project) return;
    router.push(`/ramen/${project?.id}`);
  };

  return (
    <div
      className={clsx('cursor-pointer text-black font-[500] text-[16px] leading-[90%] font-Montserrat bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[10px_15px_7px] grid grid-cols-[280px_115px_180px_130px_90px_1fr] items-center', className)}
      onClick={onClick}
    >
      <div className="flex items-center gap-[15px]">
        <img
          src={project?.token_icon_url}
          alt=""
          className="w-[78px] h-[78px] rounded-full shrink-0"
        />
        <div className="flex flex-col gap-[10px] whitespace-nowrap flex-1 w-0">
          <div className="text-black text-[16px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
            {project?.token_name}
          </div>
          <div className="text-[#646464] text-[14px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
            {project?.token_symbol}
          </div>
        </div>
      </div>
      <div className="">
        {numberFormatter(project?.participants, 2, true)}
      </div>
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="">
          {numberFormatter(project?.total_raised_in_ether, 2, true)} BERA
        </div>
        <div className="text-[0.75em]">
          {numberFormatter(project?.total_raised_in_usd, 4, true, { prefix: '$' })}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="">
          {numberFormatter(project?.sale_price_in_bera_in_ether, 2, true)} BERA
        </div>
        <div className="text-[0.75em]">
          {numberFormatter(project?.sale_price_in_usd, 4, true, { prefix: '$' })}
        </div>
      </div>
      <div className="opacity-50">
        Pending
      </div>
      <div className="">
        {dateFns.format(project?.date_ended, 'MM/dd/yyyy')}
      </div>
    </div>
  );
};

export default Item;
