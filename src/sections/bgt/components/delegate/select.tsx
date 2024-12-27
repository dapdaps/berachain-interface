import FlexTable, { Column } from "@/components/flex-table";
import Modal from '@/components/modal';
import { DEFAULT_CHAIN_ID } from '@/configs';
import multicallAddresses from '@/configs/contract/multicall';
import useCustomAccount from '@/hooks/use-account';
import { BGT_ABI } from "@/sections/bgt/abi";
import { BGT_ADDRESS, VALIDATORS } from '@/sections/bgt/config';
import { formatValueDecimal } from "@/utils/balance";
import { asyncFetch } from "@/utils/http";
import { multicall } from '@/utils/multicall';
import Big from "big.js";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import React, { memo, useEffect, useMemo, useState } from 'react';
import useIsMobile from '@/hooks/use-isMobile';
import Empty from '@/components/empty';
import Back from '@/sections/bgt/validator/components/back';
import Skeleton from 'react-loading-skeleton';
const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
export default memo(function Select(props: any) {
  const {
    visible,
    onClose,
    onDataChange,
    onAddressSelect,
  } = props
  const isMobile = useIsMobile();

  const Columns: Column[] = [
    {
      title: "Validator",
      dataIndex: "vaults",
      align: "left",
      width: "20%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <div className="w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden">
              <img src={record?.icon} alt={record?.name} />
            </div>
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{record?.name}</div>
          </div>
        );
      },
    },
    {
      title: "User Staked",
      dataIndex: "userStaked",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.userStaked ?? 0, '', 2, false, false)} BGT</div>;
      },
    },
    {
      title: "User Queued",
      dataIndex: "userQueued",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.userQueued ?? 0, '', 2, false, false)} BGT</div>;
      },
    },
    {
      title: "BGT delegated",
      dataIndex: "BGTDelegated",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.BGTDelegated ?? 0, '', 2, true, false)} BGT</div>;
      },
    },
    {
      title: "Commission",
      dataIndex: "commission",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.commission ?? 0, '', 2, false, false)} %</div>
        );
      },
    },
    {
      title: "vApy",
      dataIndex: "vApy",
      align: "left",
      width: "10%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.vApy ?? 0, '', 2, false, false)} %</div>
        );
      },
    },
    {
      title: "Incentives",
      dataIndex: "incentives",
      align: "left",
      width: "10%",
      render: (text: string, record: any) => {
        return record?.activeIncentives?.length > 0 ? (
          <div>No Incentives</div>
        ) : (
          <div>-</div>
        );
      },
    },

  ];
  const {
    provider, account
  } = useCustomAccount()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState("")
  const [validators, setValidators] = useState<any>(null)

  const filterValidators = useMemo(() => validators?.filter((validator: any) => validator?.name?.toLocaleLowerCase().indexOf(value?.toLocaleLowerCase()) > -1), [value, loading])


  const getUserStaked = async () => {
    const calls: any = []
    VALIDATORS.forEach(validator => {
      calls.push({
        address: BGT_ADDRESS,
        name: 'boosted',
        params: [account, validator?.address]
      })
    })
    return (await multicall({
      abi: BGT_ABI,
      options: {},
      calls,
      multicallAddress,
      provider
    })).map((res: any) => res?.[0] ?? null)
  }
  const getUserQueued = async () => {
    const calls: any = []
    VALIDATORS.forEach(validator => {
      calls.push({
        address: BGT_ADDRESS,
        name: 'boostedQueue',
        params: [account, validator?.address]
      })
    })
    return (await multicall({
      abi: BGT_ABI,
      options: {},
      calls,
      multicallAddress,
      provider
    })).map((res: any) => res?.[1] ?? null)
  }
  const getBGTDelegated = async () => {
    const calls: any = []
    VALIDATORS.forEach(validator => {
      calls.push({
        address: BGT_ADDRESS,
        name: 'boostees',
        params: [validator?.address]
      })
    })
    return (await multicall({
      abi: BGT_ABI,
      options: {},
      calls,
      multicallAddress,
      provider
    })).map((res: any) => res?.[0] ?? null)
  }
  const getCommission = async () => {
    const calls: any = []
    VALIDATORS.forEach(validator => {
      calls.push({
        address: BGT_ADDRESS,
        name: 'commissions',
        params: [validator?.address]
      })
    })
    return (await multicall({
      abi: BGT_ABI,
      options: {},
      calls,
      multicallAddress,
      provider
    })).map((res: any) => res?.[1] ?? null)
  }
  const getVApyAndIncentives = async () => {

    const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/validators?sortBy=votingpower&sortOrder=desc&page=1&pageSize=206&query=")

    const vApyAndIncentives: any = []
    const validators = response?.validators

    VALIDATORS.forEach(validator => {
      const idx = validators.findIndex((_validator: any) => _validator?.id === validator?.address)
      if (idx > -1) {
        vApyAndIncentives.push({
          ...validators[idx],
          vApy: Big(validators[idx]?.apy).div(100).toFixed(),
          // incentives:
        })
      }
    })
    return vApyAndIncentives

  }
  const getIncentives = async () => {

  }
  const getValidators = async () => {

    console.log('====1111====')
    const promiseArray = [
      getUserStaked(),
      getUserQueued(),
      getBGTDelegated(),
      getCommission(),
      getVApyAndIncentives()
    ]
    const _validators = []

    try {

      setLoading(true)
      const result = await Promise.all(promiseArray)
      for (let i = 0; i < VALIDATORS.length; i++) {

        console.log('==result?.[3]?.[i]', Big(result?.[3]?.[i]?.toString()).div(100))
        _validators.push({
          ...VALIDATORS[i],
          validator: result?.[4]?.[i],
          userStaked: result?.[0]?.[i] ? ethers.utils.formatUnits(result?.[0]?.[i]) : 0,
          userQueued: result?.[1]?.[i] ? ethers.utils.formatUnits(result?.[1]?.[i]) : 0,
          BGTDelegated: result?.[2]?.[i] ? ethers.utils.formatUnits(result?.[2]?.[i]) : 0,
          commission: result?.[3]?.[i] ? Big(result?.[3]?.[i]?.toString()).div(100).toFixed() : 0,
          vApy: result?.[4]?.[i]?.vApy,
        })
      }
      setLoading(false)
      setValidators(_validators)
    } catch (error) {
      setLoading(false)
      console.error(error)
    }
  }
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
                  onAddressSelect && onAddressSelect(record?.address);
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
                              onAddressSelect && onAddressSelect(d?.address);
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
