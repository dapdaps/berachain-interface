"use client";

import FlexTable, { Column } from "@/components/flex-table";
import Loading from "@/components/loading";
import SwitchTabs from "@/components/switch-tabs";
import { useBGT } from "@/hooks/use-bgt";
import Select from "@/sections/bgt/components/delegate/select";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText, getProtocolIcon } from "@/utils/utils";
import Big from 'big.js';
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import BgtEmpty from "./components/bgt-empty";
import VaultsList from "./components/list";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Card from "@/components/card";
import { numberFormatter } from "@/utils/number-formatter";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    console.log('====data', data)
    return (
      <Card>
        <div className="flex gap-[8px]">
          <div className="w-[4px] h-[72px] rounded-[2px]" style={{ backgroundColor: data?.color }}></div>
          <div className="flex flex-col justify-between">
            <div className="text-black">{numberFormatter(data?.payload?.value, 2, true)}%</div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <img
                  src={data?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
                  className="min-w-[30px] w-[30px] h-[30px] bg-[#0d0703] bg-opacity-10 border border-[#0d0703] text-white rounded-full"
                  alt={data?.metadata?.name}
                />
                <img
                  src={getProtocolIcon(data?.metadata?.protocolName)}
                  className="w-[16px] h-[16px] absolute bottom-0 right-0"
                  alt=""
                />
              </div>
              <div className="flex flex-col justify-between items-stretch">
                <div className="text-[16px] font-[600] whitespace-nowrap">
                  {data?.metadata?.name}
                </div>
                <div className="text-[10px] font-[400]">
                  {data?.metadata?.protocolName}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }
  return null;
};
export default memo(function BgtMain() {
  const router = useRouter()
  const [tab, setTab] = useState('all');
  const [selectVisible, setSelectVisible] = useState(false)
  const Columns: Column[] = [
    {
      title: 'Vaults',
      dataIndex: 'Vaults',
      align: 'left',
      width: '30%',
      render: (text: string, record: any) => {
        const vault = record?.vault
        return (
          <div className='flex items-center gap-[16px]'>
            <div className='relative'>
              <div className='w-[30px] h-[30px] rounded-full'>
                <img src={vault?.metadata?.logoURI} />
              </div>
              <div className="absolute right-[-6px] bottom-[-2px] w-[16px]">
                <img src={getProtocolIcon(vault?.metadata?.protocolName)} />
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className='text-black font-Montserrat text-[16px] font-semibold leading-[90%]'>{vault?.metadata?.name}</div>
              <div className='text-black font-Montserrat text-[12px] font-medium leading-[90%]'>{vault?.metadata?.protocolName}</div>
            </div>
          </div>
        );
      },
    },

    {
      title: 'Amount Deposited',
      dataIndex: 'depositedAmount',
      align: 'left',
      width: '30%',
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className='flex justify-start'>
            <div className='px-[10px] py-[5px] rounded-[12px] border border-[#373A53] bg-white text-black font-Montserrat text-[14px] font-medium leading-[100%]'>
              {formatValueDecimal(record?.depositedAmount, "", 2)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'BGT Rewards',
      dataIndex: 'earned',
      align: 'left',
      width: '20%',
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[6px]">
            <div className="w-[26px] h-[26px] rounded-full">
              <img src="/images/dapps/infrared/bgt.svg" />
            </div>
            <div className='text-[#7EA82B] font-Montserrat text-[16px] font-medium leading-[100%]'>
              {formatValueDecimal(record?.earned ?? 0, "", 2)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      align: 'left',
      width: '20%',
      render: (text: string, record: any, index) => {
        return (
          <button
            disabled={Big(record?.earned || 0).lte(0) || record?.claiming}
            className='flex items-center justify-center w-[90px] h-[32px] border border-[#373A53] rounded-[10px] text-black font-Montserrat text-[14px] font-medium leading-[100%] bg-white hover:bg-[#FFDC50] disabled:opacity-30'
            onClick={() => record?.claim?.(record, index)}>
            {
              record.claiming ? <Loading /> : 'Claim BGT'
            }
          </button>
        );
      },
    },
  ];
  const {
    data: bgtData,
    loading,
    sortDataIndex,
    setSortDataIndex,
    pageData,
    filterList,
    vaults,
    vaultsLoading,
    handleClaim,
    handleExplore,
    handleValidator,
  } = useBGT(tab);

  const ChartsData = useMemo(() => {
    const ColorMapping = {
      "WBERA | HONEY": "#5eca58",
      "WBTC | WBERA": "#60d05e",
      "WETH | WBERA": "#585ecb",
      "BYUSD | HONEY": "#46c1c5",
      "USDC.e | HONEY": "#5b85cd"
    }
    return vaults?.map(vault => {
      return {
        name: vault?.metadata?.name,
        value: +Big(vault?.dynamicData?.bgtCapturePercentage ?? 0).times(100).toFixed(),
        metadata: vault?.metadata,
        color: ColorMapping?.[vault?.metadata?.name] ?? "#5eca58"
      }
    })
  }, [vaults]);
  const BgtDistributed = useMemo(() => vaults?.reduce((acc, curr) => Big(acc).plus(curr?.dynamicData?.allTimeReceivedBGTAmount ?? 0).toFixed(), 0), [vaults])

  console.log('====vaults', vaults)
  console.log('=====ChartsData', ChartsData)
  console.log('====BgtDistributed', BgtDistributed)
  return (
    <div className="w-[1140px]">
      <div className="flex items-center h-[223px] rounded-[20px] bg-[#FFDC50]">
        <div className=" h-full flex flex-col flex-[0.7] py-[34px] pl-[30px] relative justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Active Reward Vaults</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{pageData?.polGetGlobalInfo?.totalActiveRewardVaults}</div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Active Incentives</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.polGetGlobalInfo?.sumAllIncentivesInHoney, "$", 2, true, false)}</div>
          </div>

          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>

        <div className="h-full flex flex-col items-start flex-[1.3] py-[34px] pl-[30px] relative">
          <div className="w-[320px] flex items-center justify-between mb-[10px] ">
            <div className="text-[#3D405A]">Top 3 Validators</div>
            <div className="text-[#3D405A] cursor-pointer underline" onClick={() => {
              setSelectVisible(true)
            }}>More</div>
          </div>
          <div className="flex flex-col gap-[12px]">
            {
              pageData?.top3EmittingValidators?.validators?.map((validator: any) => (
                <div
                  className="cursor-pointer flex items-center justify-between w-[420px] min-h-[34px] py-[5px] pr-[18px] pl-[5px] border border-[#373A53] bg-[#FFFDEB] rounded-[18px]"
                  onClick={() => handleValidator(validator)}
                >
                  <div className="flex items-center">
                    <div className="w-[26px] h-[26px] rounded-full overflow-hidden">
                      <img src={validator?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"} alt={validator?.metadata?.name} />
                    </div>
                    <div className="truncate ml-[7px] mr-[10px] text-black  max-w-[230px] font-Montserrat text-[16px] font-semibold">
                      {validator?.metadata?.name || formatLongText(validator?.pubkey, 4, 4)}
                    </div>
                    <div className="text-black font-Montserrat text-[12px] font-medium leading-[100%]">BGT/Year: {formatValueDecimal(Big(validator?.dynamicData?.lastDayDistributedBGTAmount).times(360).toFixed(), "", 2, true)}</div>
                  </div>

                  <svg xmlns="http://www.w3.org/2000/svg" width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <path d="M1 11L6 6L1 1" stroke="black" stroke-width="2" stroke-linecap="round" />
                  </svg>
                </div>
              ))
            }
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="h-full flex flex-col flex-1 py-[24px] pl-[30px] justify-between">
          <div className="">
            <div className="text-black">Reward Weights</div>
            <div className="w-[180px] h-[180px] relative">
              <div className="absolute left-0 top-0 bottom-0 right-0 flex  flex-col items-center justify-center pointer-events-none">
                <div className="text-black text-[10px]">BGT DISTRIBUTED</div>
                <div className="text-black text-[10px]">{numberFormatter(BgtDistributed, 2, true, { isShort: true })}</div>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ChartsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={3}
                    cornerRadius={6}
                    stroke="none"
                    activeShape={null}
                  >
                    {ChartsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry?.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>

            </div>
          </div>
        </div>

      </div>
      <div className="my-[30px] flex justify-between items-center">

        <SwitchTabs
          tabs={[
            { label: 'All Vaults', value: 'all' },
            { label: 'Your Vaults', value: 'your' },
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-[200px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
      </div>
      {
        tab === 'all' ? (
          <VaultsList />
        ) : (
          <FlexTable
            loading={loading}
            columns={Columns}
            list={filterList}
            sortDataIndex={sortDataIndex}
            renderEmpty={() => (
              <BgtEmpty handleExplore={handleExplore} />
            )}
            onChangeSortDataIndex={(index) => {
              setSortDataIndex(sortDataIndex === index ? "" : index)
            }}
          />
        )
      }
      <Select
        visible={selectVisible}
        onClose={() => {
          setSelectVisible(false)
        }}
        onValidatorSelect={(id) => {
          router.push("/bgt/validator?id=" + id);
        }}
      />
    </div>
  )
})