import clsx from 'clsx';
import { useVaultsV2Context } from '@/sections/vaults/v2/context';
import {
  APY,
  DepositButton, Rewards, TVL,
  Vaults, WithdrawButton, Yours,
} from '@/sections/vaults/v2/components/vaults-table/columns';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ORDER_DIRECTION } from '@/sections/vaults/v2/config';
import LazyImage from '@/components/layz-image';
import Skeleton from 'react-loading-skeleton';
import Search from '@/sections/vaults/v2/components/filter/search';
import Empty from '@/components/empty';

const VaultsTableMobile = (props: any) => {
  const { className } = props;

  const {
    listDataGroupByPool,
    listLoading,
    listOrderKeys,
    listFilterSelectedLength,
    toggleListOrder,
    toggleListFilterVisible
  } = useVaultsV2Context();

  const [isExpanded, setIsExpanded] = useState<number>();

  const toggleExpand = (index: number) => {
    setIsExpanded(index === isExpanded ? void 0 : index);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center gap-[10px] mt-[9px]">
        <div className="flex items-center gap-[8px] pl-[8px]">
          <div className="text-[#000] text-center font-Montserrat text-[12px] font-[600] leading-[100%]">Rank</div>
          <div className="flex items-center gap-[5px]">
            {
              listOrderKeys.slice().sort((a, b) => a.sort - b.sort).map((ok) => (
                <button
                  type="button"
                  key={ok.label}
                  className={clsx(
                    "w-[58px] h-[26px] flex gap-[4px] justify-center transition-all duration-300 items-center flex-shrink-0 rounded-[6px] border-[1px] text-[#000] font-Montserrat text-[12px] font-[500] leading-[100%]",
                    listOrderKeys[0]?.value === ok.value ? "bg-[#FDD54C] border-black" : "border-[rgba(0,0,0,.2)]",
                  )}
                  onClick={() => {
                    toggleListOrder(ok.value);
                  }}
                >
                  <div className="">{ok.label}</div>
                  <img
                    src="/images/vaults/v2/triangle.svg"
                    alt=""
                    className={clsx(
                      "w-[10px] h-[10px] object-center object-contain transition-all duration-300",
                      ok?.direction === ORDER_DIRECTION.ASC ? "rotate-180" : "",
                      ok?.value === listOrderKeys[0]?.value ? "opacity-100" : "opacity-50",
                    )}
                  />
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
            <LazyImage src="/images/vaults/v2/filter.svg" width={14} height={14} fallbackSrc="/assets/tokens/default_icon.png" />
            <div className="">
              Filter
            </div>
          </div>
          <div
            className="flex justify-center items-center w-[26px] h-[26px] flex-shrink-0 rounded-[6px] border-[1px] border-[#000] bg-[#FDD54C] text-[#000] text-center font-Montserrat text-[12px] font-[600] leading-[100%]"
          >
            {listFilterSelectedLength}
          </div>
        </button>
      </div>
      <div className="flex mt-[9px]">
        <Search className="flex-1 w-0" />
      </div>
      <div className={clsx("w-full text-[16px] text-black leading-[100%] font-[600] font-Montserrat mt-[13px] flex flex-col items-stretch gap-[10px]", className)}>
        {
          listLoading ? (
            <>
              <Skeleton width="100%" height={118} borderRadius={10} />
              <Skeleton width="100%" height={118} borderRadius={10} />
            </>
          ) : listDataGroupByPool?.length > 0 ? listDataGroupByPool.map((record: any, index: number) => (
            <div
              key={index}
              className="w-full shrink-0 rounded-[10px] bg-[rgba(0,0,0,0.06)]"
            >
              <div
                className="p-[16px_14px_9px_14px]"
                onClick={() => toggleExpand(index)}
              >
                <div className="flex justify-between items-center gap-[10px]">
                  <Vaults isPool={true} record={record} index={index} className="flex-1 w-0" />
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
                      APR
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
                  isExpanded === index && (
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
                            <Yours record={record} index={index} />
                          </div>
                          <WithdrawButton record={record} index={index} className="shrink-0" />
                        </div>
                      </div>
                      <div className="flex justify-between items-center gap-[10px]">
                        <div className="text-[#3D405A] font-Montserrat text-[14px] font-[500] leading-normal">
                          Your Rewards
                        </div>
                        <div className="flex justify-end items-center gap-[10px] text-[#000] font-Montserrat text-[16px] font-[600] leading-[100%]">
                          <Rewards record={record} index={index} />
                        </div>
                      </div>
                    </motion.div>
                  )
                }
              </AnimatePresence>
            </div>
          )) : (
            <div className="flex justify-center items-center py-[30px]">
              <Empty desc="No vaults available" />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default VaultsTableMobile;
