import Big from 'big.js';
import { formatValueDecimal } from '@/utils/balance';
import clsx from 'clsx';
import { formatLongText } from '@/utils/utils';
import Loading from '@/components/loading';
import Skeleton from 'react-loading-skeleton';
const Nav = (props: any) => {
  const { pageData, handleClick } = props;

  return (
    <div className="flex md:flex-col items-start md:items-stretch justify-between md:justify-start h-[146px] md:h-[unset] rounded-[20px] bg-[#FFDC50] pl-[87px] md:mt-[13px] md:px-[14px] md:pb-[14px]">
      <div className="flex-1 mt-[11px] mr-[69px] md:mr-[unset]">
        <div className="flex items-center gap-[17px] md:justify-center">
          {
            pageData ? (
              <div className="w-[40px] h-[40px] rounded-[20px] border border-black overflow-hidden">
                <img src={pageData?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"} alt={pageData?.metadata?.name} />
              </div>
            ) : (
              <Skeleton className='w-[40px] h-[40px] rounded-full' />
            )
          }
          {
            pageData ? (
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                {pageData?.metadata?.name ?? formatLongText(pageData?.pubkey, 4, 4)}
              </div>
            ) : (
              <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
            )
          }
        </div>
        <div className="flex items-center justify-between mt-[24px] md:flex-wrap md:gap-y-[31px]">
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">BGT emitted</div>
            {
              pageData ? (
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.dynamicData?.allTimeDistributedBGTAmount, "", 2, true)} BGT</div>
              ) : (
                <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
              )
            }
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Bera staked</div>
            {
              pageData ? (
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.dynamicData?.stakedBeraAmount, '', 2, true)}</div>
              ) : (
                <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
              )
            }
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Boosted</div>

            {
              pageData ? (
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.dynamicData?.activeBoostAmount, '', 2, true)}</div>
              ) : (
                <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
              )
            }
          </div>
          <div className="flex flex-col gap-[12px] md:w-1/2">
            <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Website</div>
            {
              pageData ? (
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%] w-full overflow-hidden overflow-ellipsis">{pageData?.metadata?.website ? pageData?.metadata?.website : "-"}</div>
              ) : (
                <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
              )
            }
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
          Boost +
        </div>
        <div
          className={clsx(BTN_CLASS, "!bg-transparent border-black/50 md:flex-1")}
          onClick={() => {
            handleClick("unbond")
          }}
        >
          UnBoost -
        </div>
      </div>
    </div>
  );
};

export default Nav;

const BTN_CLASS = "cursor-pointer flex items-center justify-center w-[203px] h-[46px] rounded-[10px] border border-black bg-white text-black text-[16px] font-Montserrat font-semibold"
