import FlexTable, { Column } from "@/components/flex-table";
import Modal from '@/components/modal';
import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import useCustomAccount from '@/hooks/use-account';
import { BGT_ABI } from "@/sections/bgt/abi";
import { BGT_ADDRESS, VALIDATORS } from '@/sections/bgt/config';
import { formatValueDecimal } from "@/utils/balance";
import { asyncFetch, post } from "@/utils/http";
import { multicall } from '@/utils/multicall';
import Big from "big.js";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useMemo, useState } from 'react';
import useIsMobile from '@/hooks/use-isMobile';
import Empty from '@/components/empty';
import Back from '@/sections/bgt/validator/components/back';
import Skeleton from 'react-loading-skeleton';
import { BEARCHAIN_API } from "@/hooks/use-bgt";
import { formatLongText } from "@/utils/utils";
import useValidators from "./hooks/use-validators";
const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
export default memo(function Select(props: any) {
  const {
    visible,
    onClose,
    onDataChange,
    onValidatorSelect,
  } = props
  const isMobile = useIsMobile();


  const {
    provider, account
  } = useCustomAccount()
  const {
    loading,
    validators,
    getValidators
  } = useValidators()
  const router = useRouter()
  const [value, setValue] = useState("")
  const filterValidators = useMemo(() => validators?.filter((validator: any) => validator?.metadata?.name?.toLocaleLowerCase().indexOf(value?.toLocaleLowerCase()) > -1 || validator?.id?.toLocaleLowerCase().indexOf(value?.toLocaleLowerCase()) > -1), [value, loading])
  
  const Columns: Column[] = [
    {
      title: "Validator",
      dataIndex: "vaults",
      align: "left",
      width: "23%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <div className="w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden">
              <img src={record?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"} alt={record?.name} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="truncate text-black font-Montserrat text-[16px] font-medium leading-[90%]">{record?.metadata?.name ?? formatLongText(record?.pubkey, 4, 4)}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Boosts",
      dataIndex: "userStaked",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.dynamicData?.activeBoostAmount ?? 0, '', 2, true, false)} BGT</div>;
      },
    },
    {
      title: "Staked",
      dataIndex: "userQueued",
      align: "left",
      width: "17%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.dynamicData?.stakedBeraAmount ?? 0, '', 2, true, false)} BGT</div>;
      },
    },
    {
      title: "BGT Emissions (24h)",
      dataIndex: "BGTDelegated",
      align: "left",
      width: "17%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.dynamicData?.lastDayDistributedBGTAmount ?? 0, '', 2, true, false)} BGT</div>;
      },
    },
    {
      title: "Boost APY",
      align: "left",
      width: "13%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">-</div>
        );
      },
    },
    {
      title: "Incentives",
      dataIndex: "incentives",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div>No Incentives</div>;
      },
    },

  ];

  useEffect(() => {
    if (visible && account) {
      getValidators()
    }
  }, [visible, account])
  return (
    <Modal open={visible} onClose={onClose} innerStyle={{ width: 'unset' }}>
      <div className='px-[32px] md:px-[12px] pt-[28px] w-[1040px] md:w-full h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]'>
        <div className='flex flex-col gap-[8px]'>
          <div className='flex items-center gap-[16px] text-lg font-semibold leading-7'>
            {
              isMobile && (
                <Back onBack={onClose} />
              )
            }
            Validator Select
          </div>
          <div className='flex'>
            <div className='w-auto flex items-center border bg-[#fff] rounded-[12px] overflow-hidden border-[#373A53] px-[15px] gap-[10px]'>
              <svg
                width='21'
                height='15'
                viewBox='0 0 21 15'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <circle
                  cx='7.01829'
                  cy='7.01829'
                  r='6.01829'
                  stroke='#3D4159'
                  stroke-width='2'
                />
                <rect
                  x='14.9138'
                  y='9.64978'
                  width='6.141'
                  height='2.63186'
                  rx='1.31593'
                  transform='rotate(30 14.9138 9.64978)'
                  fill='#3D4159'
                />
              </svg>
              <input
                className=' w-[300px] h-[40px] bg-inherit outline-none'
                placeholder='search by name'
                value={value || ''}
                onChange={(ev: any) => {
                  setValue(ev.target.value)
                }}
              />
            </div>
          </div>
          {
            !isMobile && (
              <FlexTable
                loading={loading}
                columns={Columns}
                list={filterValidators}
                bodyClass="cursor-pointer"
                onRow={(record) => {
                  // router.replace('/bgt/validator?address=' + record?.address)
                  onValidatorSelect && onValidatorSelect(record?.id);
                  onClose && onClose()
                }}
              />
            )
          }
          {
            isMobile && (
              <>
                {
                  !loading && (filterValidators?.length > 0 ? filterValidators?.map((d: any, idx: number) => (
                    <div key={idx} className="w-full flex flex-wrap gap-y-[36px] bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[17px_12px_24px]">
                      {
                        Columns.map((c: any, index: number) => (
                          <div
                            key={`col-${index}`}
                            className={`${index % 2 === 0 ? 'w-[60%]' : 'w-[40%]'}`}
                            onClick={() => {
                              onValidatorSelect && onValidatorSelect(d?.id);
                              onDataChange && onDataChange(d)
                              onClose && onClose();
                            }}
                          >
                            <div className="text-[#3D405A] font-[500] text-[14px] mb-[5px] whitespace-nowrap">{c.title}</div>
                            {c.render(d[c.dataIndex], d)}
                          </div>
                        ))
                      }
                    </div>
                  )) : (
                    <div className="py-[30px]">
                      <Empty desc="No data" />
                    </div>
                  ))
                }
                {
                  loading && (
                    <div className="w-full flex flex-col gap-[30px]">
                      <Skeleton width="100%" height={300} borderRadius={10} />
                      <Skeleton width="100%" height={300} borderRadius={10} />
                    </div>
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </Modal>
  )
})
