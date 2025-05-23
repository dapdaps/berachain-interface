import CircleLoading from '@/components/circle-loading';
import Loading from '@/components/loading';
import useClickTracking from '@/hooks/use-click-tracking';
import BgtEmpty from '@/sections/bgt/components/bgt-empty';
import { formatValueDecimal } from '@/utils/balance';
import { formatLongText, getProtocolIcon } from '@/utils/utils';
import Big from 'big.js';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

const YourVaults = (props: any) => {
  const { filterList, handleExplore, isLoading } = props;
  const { handleReport } = useClickTracking();

  useEffect(() => {
    handleReport('1016-002');
  }, []);

  console.log("====filterList", filterList)
  return (
    <motion.div
      key="vaults"
      className="pb-[20px]"
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
      {
        filterList?.length > 0 && (
          <>
            <div className="flex flex-col gap-[12px] mt-[12px] px-[12px]">
              {
                filterList.map((record: any, idx: number) => {
                  console.log(record?.earned, record?.earnedShown);
                  const vault = record?.vault
                  return (
                    <div key={idx} className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[16px_14px_11px_12px]">

                      <div className="flex justify-between">

                        <div className='flex items-center gap-[16px]'>
                          <div className='relative'>
                            <div className='w-[30px] h-[30px] rounded-full'>
                              <img src={vault?.metadata?.logoURI ?? "/images/bgt-logo.svg"} />
                            </div>
                            <div className="absolute right-[-6px] bottom-[-2px] w-[16px]">
                              <img src={getProtocolIcon(vault?.metadata?.protocolName)} />
                            </div>
                          </div>
                          <div className="flex flex-col gap-[5px]">
                            <div className='text-black font-Montserrat text-[16px] font-semibold leading-[100%]'>{vault?.metadata?.name ? vault?.metadata?.name : formatLongText(vault?.id, 4, 4)}</div>
                            <div className='text-black font-Montserrat text-[12px] font-medium leading-[100%]'>{vault?.metadata?.protocolName ?? "OTHER"}</div>
                          </div>
                        </div>

                        <div>
                          <div className="text-[#3D405A] text-[14px] leading-[16px] font-[500] text-right">
                            Amount Deposited
                          </div>
                          <div className="flex items-center justify-end gap-[7px] mt-[5px]">
                            <div className="text-black text-[16px] font-[600] leading-[12px]">
                              {formatValueDecimal(record?.depositAmount, "", 2)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between mt-[20px]">
                        <div className="">
                          <div className="text-[#3D405A] text-[14px] font-[500]">
                            BGT Rewards
                          </div>
                          <div className="flex items-center gap-[7px] mt-[6px]">
                            <img
                              src="/images/dapps/infrared/bgt.svg"
                              alt=""
                              className="w-[22px] h-[22px] rounded-full"
                            />
                            <div className="text-[#7EA82B] text-[16px] font-[600]">
                              {formatValueDecimal(record?.earned ?? 0, "", 2)}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end items-center">
                          <button
                            type="button"
                            disabled={Big(record?.earned || 0).lte(0) || record?.claiming}
                            className="text-black text-[14px] font-[500] border border-black h-[36px] px-[17px] rounded-[10px] bg-white disabled:opacity-30 disabled:pointer-events-none"
                            onClick={() => record.claim?.(record, idx)}
                          >
                            {
                              record.claiming ? <Loading /> : 'Claim BGT'
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        )
      }
      {
        isLoading && (
          <div className='mt-[8px] flex justify-center'>
            <CircleLoading />
          </div>
        )
      }
      {
        !isLoading && !filterList?.length && (
          <div className="mt-[145px]">
            <BgtEmpty handleExplore={handleExplore} />
          </div>
        )
      }
    </motion.div>
  );
};

export default YourVaults;
