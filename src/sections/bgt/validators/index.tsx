import FlexTable, { Column } from "@/components/flex-table";
import Pager from "@/components/pager";
import SwitchTabs from "@/components/switch-tabs";
import { useBGT } from "@/hooks/use-bgt";
import { numberFormatter } from "@/utils/number-formatter";
import { formatLongText } from "@/utils/utils";
import Big from "big.js";
import { memo, useState } from "react";
import BgtEmpty from "../components/bgt-empty";
import useList from "./hooks/use-list";
import { bera } from "@/configs/tokens/bera";
import QueueList from "@/sections/bgt/components/delegate/queue-list";
import { useRouter, useSearchParams } from 'next/navigation';
// import usePageData from "./hooks/use-page-data";

export default memo(function Validators() {
  const router = useRouter()
  const { pageData } = useBGT()
  const searchParams = useSearchParams();
  const searchParamFrom = searchParams.get("from");

  const [currentTab, setCurrentTab] = useState("all")

  const {
    page,
    sortBy,
    loading,
    maxPage,
    sortOrder,
    filterList,
    delegationQueue,
    loadingDelegationQueue,
    // sortDataIndex,
    handleSort,
    handleSearch,
    handlePageChange,
  } = useList(currentTab)

  const Columns: Column[] = currentTab === "all" ? [
    {
      title: "VALIDATOR",
      dataIndex: "validator",
      align: "left",
      width: "20%",
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
      title: "BOOSTS",
      dataIndex: "activeBoostAmount",
      sort: true,
      align: "left",
      width: "13%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.dynamicData?.activeBoostAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
      },
    },
    {
      title: "STAKED",
      dataIndex: "stakedBeraAmount",
      sort: true,
      align: "left",
      width: "12%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.dynamicData?.stakedBeraAmount ?? 0, 2, true, { isShort: true, })} BGT</div>;
      },
    },
    {
      title: "BGT EMISSIONS (24h)",
      dataIndex: "lastDayDistributedBGTAmount",
      sort: true,
      align: "left",
      width: "16%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.dynamicData?.lastDayDistributedBGTAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
      },
    },
    {
      title: "BOOST APY",
      dataIndex: "boostApr",
      sort: true,
      align: "left",
      width: "12%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(Big(record?.dynamicData?.boostApr).times(100).toFixed(), 2, true)}%</div>
        );
      },
    },
    {
      title: "COMMISSION",
      dataIndex: "commissionOnIncentives",
      sort: true,
      align: "left",
      width: "12%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(Big(record?.dynamicData?.commissionOnIncentives).div(100).toFixed(), 2, true)}%</div>
        );
      },
    },
    {
      title: "INCENTIVES",
      dataIndex: "incentives",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        const incentives = record?.rewardAllocationWeights?.reduce((acc, curr) => {
          curr?.receivingVault?.activeIncentives?.forEach(activeIncentive => {
            if (!acc.find((incentive) => incentive?.token?.symbol === activeIncentive?.token?.symbol)) acc.push(activeIncentive);
          })
          return acc
        }, [])
        return incentives?.length > 0 ? (
          <div className="flex items-center">
            {
              incentives?.map((incentive, index) => (
                <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full ml-[-5px] overflow-hidden bg-[#1f1c19] text-[#eae8e6] text-[8px] font-medium">
                  {
                    bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon ? (
                      <img src={bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon} alt={incentive?.token?.symbol} />
                    ) : (
                      <span>{incentive?.token?.symbol}</span>
                    )
                  }
                </div>
              ))
            }
          </div>
        ) : <div>No Incentives</div>;
      },
    },
  ] : [{
    title: "VALIDATOR",
    dataIndex: "validator",
    align: "left",
    width: "25%",
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
  }, {
    title: "BOOSTS",
    dataIndex: "boosts",
    align: "left",
    width: "15%",
    render: (text: string, record: any) => {
      return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.activeBoostAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
    },
  }, {
    title: "QUEUED BOOSTS",
    dataIndex: "queued_boosts",
    align: "left",
    width: "15%",
    render: (text: string, record: any) => {
      return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.queuedBoostAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
    },
  }, {
    title: "QUEUED UNBOOSTS",
    dataIndex: "queued_unboosts",
    align: "left",
    width: "15%",
    render: (text: string, record: any) => {
      return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.queuedDropBoostAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
    },
  }, {
    title: "BGT EMISSIONS (24h)",
    dataIndex: "bgt_emissions",
    align: "left",
    width: "15%",
    render: (text: string, record: any) => {
      return <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">{numberFormatter(record?.dynamicData?.lastDayDistributedBGTAmount ?? 0, 2, true, { isShort: true })} BGT</div>;
    },
  }, {
    title: "INCENTIVES",
    dataIndex: "incentives",
    align: "left",
    width: "15%",
    render: (text: string, record: any) => {
      const incentives = record?.rewardAllocationWeights?.reduce((acc, curr) => {
        curr?.receivingVault?.activeIncentives?.forEach(activeIncentive => {
          if (!acc.find((incentive) => incentive?.token?.symbol === activeIncentive?.token?.symbol)) acc.push(activeIncentive);
        })
        return acc
      }, [])
      return incentives?.length > 0 ? (
        <div className="flex items-center">
          {
            incentives?.map((incentive, index) => (
              <div className="flex items-center justify-center w-[24px] h-[24px] rounded-full ml-[-5px] overflow-hidden bg-[#1f1c19] text-[#eae8e6] text-[8px] font-medium">
                {
                  bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon ? (
                    <img src={bera[incentive?.token?.symbol?.toLocaleLowerCase()]?.icon} alt={incentive?.token?.symbol} />
                  ) : (
                    <span>{incentive?.token?.symbol}</span>
                  )
                }
              </div>
            ))
          }
        </div>
      ) : <div>No Incentives</div>;
    },
  },];

  return (
    <div className="w-[1140px]">
      <div className="flex items-center h-[124px] rounded-[20px] bg-[#FFDC50]">
        <div className="relative h-full flex flex-col flex-[0.8] py-[34px] pl-[30px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Total Active Validators</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{pageData?.polGetGlobalInfo?.totalValidatorsCount}</div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="relative h-full flex flex-col flex-[0.8] py-[34px] pl-[30px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Total Boosts</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{numberFormatter(pageData?.polGetGlobalInfo?.totalActiveBoostAmount, 2, true, { isShort: true })} BGT</div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="relative h-full flex flex-col flex-[0.8] py-[34px] pl-[30px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Total Bera Staked</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{numberFormatter(pageData?.polGetGlobalInfo?.totalStakedBeraAmount, 2, true, { isShort: true })} BERA</div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="relative h-full flex flex-col flex-[0.8] py-[34px] pl-[30px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Total Active Incentives</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">{numberFormatter(pageData?.polGetGlobalInfo?.totalActiveIncentivesValueUSD, 2, true, { prefix: "$", isShort: true })}</div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
      </div>
      <div className="my-[30px] flex justify-between items-center">
        <SwitchTabs
          tabs={[
            { label: 'All Validators', value: 'all' },
            { label: 'My Boosts', value: 'my' },
            { label: 'Queued Boosts', value: 'queued' },
          ]}
          onChange={(val) => {
            setCurrentTab(val);
          }}
          current={currentTab}
          className="w-[380px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
        {
          currentTab === "all" && (
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
                  className='w-[300px] h-[40px] bg-inherit outline-none'
                  placeholder='Search...'
                  onChange={(ev: any) => {
                    handleSearch(ev.target.value)
                  }}
                />
              </div>
            </div>
          )
        }
      </div>

      {
        (currentTab === "all" || currentTab === "my") && (
          <FlexTable
            loading={loading}
            columns={Columns}
            list={filterList}
            sortDataIndex={sortBy}
            sortDataDirection={sortOrder === "desc" ? 1 : -1}
            renderEmpty={() => (
              <BgtEmpty text="This wallet is not associated with a validator" />
            )}
            onChangeSortDataIndex={(index) => {
              handleSort(index, sortOrder === "desc" ? "asc" : "desc")
            }}
            onRow={(record) => {
              router.push("/bgt/validator?id=" + record.id + "&from=" + searchParamFrom)
            }}
            pagination={currentTab === "all" ? (
              <div className="flex justify-end mt-[8px]">
                <Pager defaultPage={page} maxPage={maxPage} onPageChange={handlePageChange} />
              </div>
            ) : <></>}
          />
        )
      }
      {
        currentTab === "queued" && (
          <QueueList
            loading={loadingDelegationQueue}
            className="grid grid-cols-2"
            delegationQueue={delegationQueue}
            empty={<BgtEmpty text="No validators in queue" />}
          />
        )
      }



    </div>
  )
})
