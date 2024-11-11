import Big from 'big.js';
import { formatValueDecimal } from '@/utils/balance';
import clsx from 'clsx';

const Nav = (props: any) => {
  const { pageData, handleClick } = props;

  return (
    <div className="flex md:flex-col items-start md:items-stretch justify-between md:justify-start h-[146px] md:h-[unset] rounded-[20px] bg-[#FFDC50] pl-[87px] md:mt-[13px] md:px-[14px] md:pb-[14px]">
      <div className="flex-1 mt-[11px] mr-[69px] md:mr-[unset]">
        <div className="flex items-center gap-[17px] md:justify-center">
          <div className="w-[40px] h-[40px] rounded-[20px] border border-black overflow-hidden">
            <img src={pageData?.metadata?.logoURI} alt={pageData?.metadata?.name} />
          </div>
          <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
            {pageData?.metadata?.name}
          </div>
        </div>
        <div className="flex items-center justify-between mt-[24px] md:flex-wrap md:gap-y-[31px]">
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">APY</div>
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big((pageData as any)?.apy ?? 0).div(100).toFixed(2)}%</div>
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">BGT delegated</div>
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal((pageData as any)?.amountStaked ?? 0, '', 2, true)} BGT</div>
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Commission</div>
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big((pageData as any)?.commission ?? 0).times(100).toFixed(2)} %</div>
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Website</div>
            <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] w-full overflow-hidden overflow-ellipsis">{pageData?.metadata?.website}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-[12px] mt-[26px] md:mt-[33px] mr-[26px] md:mr-[unset]">
        <div
          className={clsx(BTN_CLASS, 'md:flex-1')}
          onClick={() => {
            handleClick("delegate")
          }}
        >
          Delegate +
        </div>
        <div
          className={clsx(BTN_CLASS, "!bg-transparent border-black/50 md:flex-1")}
          onClick={() => {
            handleClick("unbond")
          }}
        >
          Unbond -
        </div>
      </div>
    </div>
  )
    ;
};

export default Nav;

const BTN_CLASS = "cursor-pointer flex items-center justify-center w-[203px] h-[46px] rounded-[10px] border border-black bg-white text-black text-[16px] font-Montserrat font-semibold"
