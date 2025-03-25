import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import {
  APY, ClaimButton,
  DepositButton, Rewards, TVL,
  Vaults, WithdrawButton,
} from '@/sections/vaults/v2/components/vaults-table/columns';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OrderKeys } from '@/sections/vaults/v2/config';
import LazyImage from '@/components/layz-image';
import Skeleton from 'react-loading-skeleton';

const VaultsTableMobile = (props: any) => {
  const { className } = props;

  const { listData, listLoading, listOrderKey, listOrderDirection, toggleListOrder, toggleListFilterVisible } = useVaultsV2Context();

  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center gap-[10px] mt-[9px]">
        <div className="flex items-center gap-[8px] pl-[8px]">
          <div className="text-[#000] text-center font-Montserrat text-[12px] font-[600] leading-[100%]">Rank</div>
          <div className="flex items-center gap-[5px]">
            {
              Object.values(OrderKeys).map((ok) => (
                <button
                  type="button"
                  key={ok.label}
                  className={clsx(
                    "w-[52px] h-[26px] flex justify-center transition-all duration-300 items-center flex-shrink-0 rounded-[6px] border-[1px] text-[#000] font-Montserrat text-[12px] font-[500] leading-[100%]",
                    listOrderKey === ok.value ? "bg-[#FDD54C] border-black" : "border-[rgba(0,0,0,.2)]",
                  )}
                  onClick={() => {
                    toggleListOrder(ok.value);
                  }}
                >
                  {ok.label}
                </button>
              ))
            }
          </div>
        </div>
        <button
          type="button"
          className="flex items-center w-[88px] h-[26px] flex-shrink-0 rounded-[6px] border-[1px] border-[rgba(0,0,0,.2)] text-[#000] text-center font-Montserrat text-[12px] font-[600] leading-[100%]"
          onClick={() => toggleListFilterVisible()}
        >
          <div className="flex-1 flex items-center gap-[4px] pl-[4px]">
            <LazyImage src="/images/vaults/v2/filter.svg" width={14} height={14} />
            <div className="">
              Filter
            </div>
          </div>
          <div
            className="flex justify-center items-center w-[26px] h-[26px] flex-shrink-0 rounded-[6px] border-[1px] border-[#000] bg-[#FDD54C] text-[#000] text-center font-Montserrat text-[12px] font-[600] leading-[100%]"
          >
            3
          </div>
        </button>
      </div>
      <div className={clsx("w-full text-[16px] text-black leading-[100%] font-[600] font-Montserrat mt-[13px] flex flex-col items-stretch gap-[10px]", className)}>
        {
          listLoading ? (
            <>
              <Skeleton width="100%" height={118} borderRadius={10} />
              <Skeleton width="100%" height={118} borderRadius={10} />
            </>
          ) : listData.map((record: any, index: number) => (
            <div
              key={index}
              className="w-full shrink-0 rounded-[10px] bg-[rgba(0,0,0,0.06)]"
            >
              <div
                className="p-[16px_14px_9px_14px]"
                onClick={toggleExpand}
              >
                <div className="flex justify-between items-center gap-[10px]">
                  <Vaults record={record} index={index} className="flex-1 w-0" />
                  <DepositButton record={record} index={index} className="shrink-0 !bg-[#FFDC50]" />
                </div>
                <div className="flex justify-between items-center gap-[10px] mt-[13px]">
                  <div className="">
                    <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                      TVL
                    </div>
                    <div className="text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%] mt-[8px]">
                      <TVL record={record} index={index} />
                    </div>
                  </div>
                  <div className="">
                    <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                      APY
                    </div>
                    <div className="text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%] mt-[8px]">
                      <APY record={record} index={index} />
                    </div>
                  </div>
                  <div className="">
                    <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                      Rewards
                    </div>
                    <div className="text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%] mt-[8px]">
                      <Rewards record={record} index={index} isClaim={false} />
                    </div>
                  </div>
                </div>
              </div>
              <AnimatePresence>
                {
                  isExpanded && (
                    <motion.div
                      key={`Expanded-${index}`}
                      className="bg-[rgba(0,0,0,0.06)] px-[14px] rounded-b-[10px] flex flex-col justify-center gap-[12px] overflow-hidden"
                      variants={{
                        visible: {
                          height: 98,
                        },
                        hide: {
                          height: 0,
                        },
                      }}
                      animate="visible"
                      initial="hide"
                      exit="hide"
                    >
                      <div className="flex justify-between items-center gap-[10px]">
                        <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                          Your Positions
                        </div>
                        <div className="flex justify-end items-center gap-[10px] text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%]">
                          <div className="">
                            $2.34M
                          </div>
                          <WithdrawButton className="shrink-0" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-[10px]">
                        <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                          Your Rewards
                        </div>
                        <div className="flex justify-end items-center gap-[10px] text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%]">
                          <div className="underline underline-offset-4 decoration-dashed">
                            $2.99
                          </div>
                          <ClaimButton className="shrink-0" />
                        </div>
                      </div>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default VaultsTableMobile;
