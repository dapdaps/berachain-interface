import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import { motion } from 'framer-motion';
import useClickTracking from '@/hooks/use-click-tracking';
import { useEffect } from 'react';

const Market = (props: any) => {
  const { pageData, onTop3, bgtData } = props;
  const { handleReport } = useClickTracking();

  useEffect(() => {
    handleReport('1016-001');
  }, []);

  return (
    <motion.div
      key="market"
      className="max-h-[calc(100%_-_120px)] overflow-y-auto pb-[20px]"
      variants={{
        visible: {
          opacity: 1,
        },
        hidden: {
          opacity: 0,
        },
      }}
      initial="hidden"
      exit="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-start gap-[63px] mt-[21px] px-[20px]">
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Active Reward Vaults</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">{pageData?.vaultCount}</div>
        </div>
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Active Incentives</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">
            {formatValueDecimal(pageData?.sumAllIncentivesInHoney, "$", 2, true)}
          </div>
        </div>
      </div>
      <div className="px-[20px] mt-[33px]">
        <div className="text-[#3D405A] font-[500] text-[14px]">
          Top 3 Validators
        </div>
        <div className="mt-[10px]">
          {
            pageData?.top3EmittingValidators?.validators?.map((data: any, idx: number) => (
              <div
                key={idx}
                className="mt-[10px] pl-[5px] pr-[14px] border border-[#373A53] rounded-[12px] bg-white h-[46px] flex justify-between items-center"
                onClick={() => onTop3(data)}
                data-bp={data.bpMobile}
              >
                <div className="flex items-center gap-[7px]">
                  <img
                    src={data?.validator?.metadata?.logoURI}
                    alt={data?.validator?.metadata?.name}
                    className="w-[26px] h-[26px] rounded-full"
                  />
                  <div className="text-[16px] text-black font-[600]">
                    {data?.validator?.metadata?.name}
                  </div>
                </div>
                <div className="flex items-center justify-end gap-[11px]">
                  <div className="text-black text-[14px] font-[500]">
                    BGT/Year: -
                  </div>
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 11L6 6L1 1" stroke="black" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="px-[20px] mt-[30px]">
        <div className="text-[#3D405A] text-[14px] font-[500]">
          Est. Yearly BGT Distribution
        </div>
        <div className="flex items-center gap-[11px] mt-[11px]">
          <img src="/images/icon-coin.svg" alt="" className="w-[26px] h-[26px] rounded-full" />
          <div className="text-black text-[18px] font-[600]">
            {formatValueDecimal(pageData?.bgtInfo?.blockCountPerYear, "", 2, true)} Yearly
          </div>
        </div>
        <div className="text-[#3D405A] text-[14px] font-[500] mt-[20px]">
          Total Circulating BGT
        </div>
        <div className="flex items-center gap-[11px] mt-[11px]">
          <img src="/images/icon-coin.svg" alt="" className="w-[26px] h-[26px] rounded-full" />
          <div className="text-black text-[18px] font-[600]">
            {formatThousandsSeparator(formatValueDecimal(bgtData?.totalSupply ?? 0, '', 2))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Market;
