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
import { memo, useEffect, useMemo, useState } from 'react';
const multicallAddress = multicallAddresses[DEFAULT_CHAIN_ID];
export default memo(function Select(props: IProps) {
  const {
    visible,
    onClose
  } = props

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
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{record?.userStaked}</div>;
      },
    },
    {
      title: "User Queued",
      dataIndex: "userQueued",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{record?.userQueued}</div>;
      },
    },
    {
      title: "BGT delegated",
      dataIndex: "BGTDelegated",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.BGTDelegated ?? 0, '', 2, true)}</div>;
      },
    },
    {
      title: "Commission",
      dataIndex: "commission",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.commission ?? 0, '', 2)}</div>
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
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{formatValueDecimal(record?.vApy ?? 0, '', 2)}</div>
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
          <div>Incentives</div>
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
  const [validators, setValidators] = useState(null)
  const filterValidators = useMemo(() => validators?.filter(validator => validator?.name?.toLocaleLowerCase().indexOf(value?.toLocaleLowerCase()) > -1), [value, loading])


  const getUserStaked = async () => {
    const calls = []
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
    })).map(res => res?.[0] ?? null)
  }
  const getUserQueued = async () => {
    const calls = []
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
    })).map(res => res?.[1] ?? null)
  }
  const getBGTDelegated = async () => {
    const calls = []
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
    })).map(res => res?.[0] ?? null)
  }
  const getCommission = async () => {
    const calls = []
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
    })).map(res => res?.[1] ?? null)
  }
  const getVApyAndIncentives = async () => {

    const response = await asyncFetch("https://bartio-pol-indexer.berachain.com/berachain/v1alpha1/beacon/validators?sortBy=votingpower&sortOrder=desc&page=1&pageSize=206&query=")

    const vApyAndIncentives = []
    const validators = response?.validators

    VALIDATORS.forEach(validator => {
      const idx = validators.findIndex(_validator => _validator?.id === validator?.address)
      if (idx > -1) {
        vApyAndIncentives.push({
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
        _validators.push({
          ...VALIDATORS[i],
          userStaked: result?.[0]?.[i] ? ethers.utils.formatUnits(result?.[0]?.[i]) : 0,
          userQueued: result?.[1]?.[i] ? ethers.utils.formatUnits(result?.[1]?.[i]) : 0,
          BGTDelegated: result?.[2]?.[i] ? ethers.utils.formatUnits(result?.[2]?.[i]) : 0,
          commission: result?.[3]?.[i] ? ethers.utils.formatUnits(result?.[3]?.[i]) : 0,
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
    if (account) {
      getValidators()
    }
  }, [account])
  return (
    <Modal open={visible} onClose={onClose}>
      <div className='px-[32px] pt-[28px] w-[1040px] h-[452px] pb-[69px] overflow-auto rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0px_0px_rgba(0,_0,_0,_0.25)]'>
        <div className='flex flex-col gap-[8px]'>
          <div className='text-lg font-semibold leading-7'>Validator select</div>
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
          <FlexTable
            loading={loading}
            columns={Columns}
            list={filterValidators}
            onRow={(record) => {
              router.replace('/bgt/validator?address=' + record?.address)
              onClose()
            }}
          />
        </div>
      </div>
    </Modal>
  )
})
