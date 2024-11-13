import { formatValueDecimal } from '@/utils/balance';
import { motion } from 'framer-motion';
import Big from 'big.js';
import Loading from '@/components/loading';
import BgtEmpty from '@/sections/bgt/components/bgt-empty';
import useClickTracking from '@/hooks/use-click-tracking';
import { useEffect } from 'react';

const Vaults = (props: any) => {
  const { filterList, handleExplore } = props;
  const { handleReport } = useClickTracking();

  useEffect(() => {
    handleReport('1016-002');
  }, []);

  return (
    <motion.div
      key="vaults"
      className="overflow-y-auto pb-[20px]"
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
        filterList?.length > 0 ? (
          <>
            {/*<div className="mt-[20px] px-[12px]">
             <button
             type="button"
             className="w-full h-[40px] flex justify-center items-center gap-[10px] border border-[#373A53] rounded-[10px] bg-white font-[600] text-[16px] text-black"
             onClick={handleExplore}
             >
             <span>Explore Vaults</span>
             <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M1 1L5.8 7L1 13" stroke="black" strokeWidth="2" strokeLinecap="round" />
             </svg>
             </button>
             </div>*/}
            <div className="mt-[12px] px-[12px]">
              {
                filterList.map((record: any, idx: number) => {
                  console.log(record?.earned, record?.earnedShown);
                  return (
                    <div key={idx} className="bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[16px_14px_11px_12px]">
                      <div className="flex items-center gap-[11px]">
                        <div className="flex items-center">
                          {
                            record?.images?.map((img: any, index: number) => (
                              <img
                                key={`img-${index}`}
                                src={img}
                                alt=""
                                className="w-[30px] h-[30px] rounded-full"
                                style={{
                                  marginLeft: index > 0 ? -10 : 0
                                }}
                              />
                            ))
                          }
                        </div>
                        <div className="text-black text-[16px] font-[600]">
                          {record.id}
                        </div>
                      </div>
                      <div className="mt-[12px]">
                        <div className="flex justify-between">
                          <div className="">
                            <div className="text-[#3D405A] text-[14px] font-[500]">
                              Protocol
                            </div>
                            <div className="flex items-center gap-[7px] mt-[6px]">
                              <img
                                src={`/images/dapps/infrared/${(record?.initialData?.pool?.protocol ?? "infrared").toLocaleLowerCase()}.svg`}
                                alt=""
                                className="w-[22px] h-[22px] rounded-full"
                              />
                              <div className="text-black text-[16px] font-[600]">
                                {record?.initialData?.pool?.protocol ?? "infrared"}
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <div className="text-[#3D405A] text-[14px] font-[500] text-right">
                              Amount Deposited
                            </div>
                            <div className="flex items-center justify-end gap-[7px] mt-[6px]">
                              <div className="text-black text-[16px] font-[600]">
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
                                {record?.earnedShown ?? 0}
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end items-center">
                            <button
                              type="button"
                              disabled={Big(record?.earned || 0).lte(0) || record?.claiming}
                              className="text-black text-[14px] font-[500] border border-black h-[36px] px-[17px] rounded-[10px] bg-white disabled:opacity-30 disabled:pointer-events-none"
                              onClick={record.claim}
                            >
                              {
                                record.claiming ? <Loading /> : 'Claim BGT'
                              }
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
          </>
        ) : (
          <div className="mt-[145px]">
            <BgtEmpty handleExplore={handleExplore} />
          </div>
        )
      }
    </motion.div>
  );
};

export default Vaults;
