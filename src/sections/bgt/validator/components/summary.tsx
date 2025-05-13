import Loading from '@/components/loading';
import { useBgtStore } from '@/stores/bgt';
import Big from 'big.js';
import Skeleton from 'react-loading-skeleton';
import { numberFormatter } from '@/utils/number-formatter';

const Summary = (props: any) => {
  const { vaults, pageData, estReturnPerBGT, currentValidator, currentValidatorLoading } = props;
  const store = useBgtStore()
  return (
    <div className="flex flex-col gap-[28px] md:gap-[21px] mt-[24px] md:mt-[33px] mb-[48px]">
      <div className="flex items-center md:items-start md:flex-wrap md:gap-y-[21px]">
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Validator Ranking</div>
          {
            pageData ? (
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                {pageData?.dynamicData?.activeBoostAmountRank} of {store?.totalCount ?? 0}
              </div>
            ) : (
              <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
            )
          }
        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Block Proposing Rate</div>
          {
            pageData ? (
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(pageData?.blockProposingRate ?? 0).toFixed(2)}%</span>
              </div>
            ) : (
              <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
            )
          }

        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Boost APY</div>
          {
            pageData && !currentValidatorLoading ? (
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                {numberFormatter(Big(currentValidator?.dynamicData?.boostApr ?? 0).times(100), 2, true)}%
              </div>
            ) : (
              <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
            )
          }
        </div>
        <div className="flex-1 flex flex-col gap-[10px] md:w-1/2 md:flex-[unset]">
          <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Est. Return per BGT</div>
          {
            pageData ? (
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                  {numberFormatter(estReturnPerBGT, 2, true, { isShort: true, prefix: "$" })}
                </span>
                {/* <div className="w-[20px] h-[20px]">
                  <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                </div> */}
              </div>
            ) : (
              <Skeleton className='w-[120px] h-[26px] rounded-[10px] leading-[26px]' />
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Summary;
