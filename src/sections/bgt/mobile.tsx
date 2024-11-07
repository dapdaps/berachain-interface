import Drawer from '@/components/drawer';
import SwitchTabs from '@/components/switch-tabs';
import { useState } from 'react';
import { useBGT } from '@/hooks/use-bgt';
import BgtHead from '@/sections/bgt/components/bgt-head';
import { formatThousandsSeparator, formatValueDecimal } from '@/utils/balance';
import { AnimatePresence, motion } from 'framer-motion';
import Loading from '@/components/loading';
import BgtEmpty from '@/sections/bgt/components/bgt-empty';

const BGTMobileView = (props: Props) => {
  const { visible, onClose } = props;

  const [tab, setTab] = useState('market');
  const {
    data: bgtData,
    loading,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    filterList,
    handleClaim,
    handleExplore,
    handleValidator,
  } = useBGT();

  return (
    <Drawer
      visible={visible}
      onClose={onClose}
    >
      <BgtHead
        bgtData={bgtData}
        style={{ position: 'absolute' }}
        className="scale-75 translate-y-[-50%] left-[50%] translate-x-[-50%]"
      />
      <div className="h-full overflow-y-auto">
        <div className="pt-[50px] px-[12px]">
          <SwitchTabs
            tabs={[
              { label: 'BGT Market', value: 'market' },
              { label: 'Your Vaults', value: 'vaults' }
            ]}
            onChange={(val) => {
              setTab(val);
            }}
            current={tab}
            className="md:h-[52px] rounded-[12px] bg-[#DFDCC4!important] border-0"
            cursorClassName="rounded-[10px]"
          />
        </div>
        <AnimatePresence mode="wait">
          {
            tab === 'market' ? (
              <motion.div
                key="market"
                className=""
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
                          onClick={() => handleValidator(data)}
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
                              BGT/Year: 9.02M
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
                      {formatThousandsSeparator(formatValueDecimal(bgtData?.totalSupply, '', 2))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="vaults"
                className=""
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
                      <div className="mt-[20px] px-[12px]">
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
                      </div>
                      <div className="mt-[12px] px-[12px]">
                        {
                          filterList.map((record: any, idx: number) => (
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
                                        {record?.earned ?? 0}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex justify-end items-center">
                                    <button
                                      type="button"
                                      className="text-black text-[14px] font-[500] border border-black h-[36px] px-[17px] rounded-[10px] bg-white"
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
                          ))
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
            )
          }
        </AnimatePresence>
      </div>
    </Drawer>
  );
};

export default BGTMobileView;

interface Props {
  visible: boolean;

  onClose(): void;
}
