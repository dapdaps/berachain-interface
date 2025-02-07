import clsx from 'clsx';
import { numberFormatter } from '@/utils/number-formatter';

const Item = (props: any) => {
  const { className } = props;

  return (
    <div className={clsx('text-black font-[500] text-[16px] leading-[90%] font-Montserrat bg-[rgba(0,_0,_0,_0.06)] rounded-[10px] p-[10px_15px_7px] grid grid-cols-[280px_115px_180px_130px_90px_1fr] items-center', className)}>
      <div className="flex items-center gap-[15px]">
        <img
          src="https://storage.googleapis.com/ramen-finance-staging/8806ff19-8ab8-4262-91cb-cdc2881e13ce"
          alt=""
          className="w-[78px] h-[78px] rounded-full shrink-0"
        />
        <div className="flex flex-col gap-[10px] whitespace-nowrap flex-1 w-0">
          <div className="text-black text-[16px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
            Gaymen Finance
          </div>
          <div className="text-[#646464] text-[14px] font-[600] leading-[90%] overflow-hidden text-ellipsis">
            GAYMEN
          </div>
        </div>
      </div>
      <div className="">
        {numberFormatter(1265, 2, true)}
      </div>
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="">
          {numberFormatter('42069.69', 2, true)} BERA
        </div>
        <div className="text-[0.75em]">
          {numberFormatter('303125.8354', 4, true, { prefix: '$' })}
        </div>
      </div>
      <div className="flex flex-col justify-center gap-[10px]">
        <div className="">
          {numberFormatter('0.01', 2, true)} BERA
        </div>
        <div className="text-[0.75em]">
          {numberFormatter('0.0721', 4, true, { prefix: '$' })}
        </div>
      </div>
      <div className="opacity-50">
        Pending
      </div>
      <div className="">
        02/02/2025
      </div>
    </div>
  );
};

export default Item;
