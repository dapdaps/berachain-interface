import CustomImage from "@/components/custom-image";
import Empty from "@/components/empty";
import SwitchTabs from "@/components/switch-tabs";
import { useBGT } from "@/hooks/use-bgt";
import BgtEmpty from "@/sections/bgt/components/bgt-empty";
import QueueList from "@/sections/bgt/components/delegate/queue-list";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import Skeleton from "react-loading-skeleton";
import useList from "./hooks/use-list";
import { numberFormatter } from "@/utils/number-formatter";
export default memo(function Mobile() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState("all")
  const { pageData } = useBGT()
  const {
    page,
    sortBy,
    loading,
    maxPage,
    sortOrder,
    filterList,
    delegationQueue,
    loadingDelegationQueue,
    handleSort,
    handleSearch,
    handlePageChange,
  } = useList(currentTab)


  const Columns: Column[] = [
    {
      title: "Validator",
      dataIndex: "vaults",
      align: "left",
      width: "23%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[8px]">
            <CustomImage
              alt={record?.metadata?.name}
              src={record?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
              className="w-[26px] h-[26px] rounded-[15px] border border-black overflow-hidden"
              errorImage="https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
            />
            <div className="flex-1 min-w-0">
              <div className="truncate text-black font-Montserrat text-[16px] font-medium leading-[90%]">
                {record?.metadata?.name ?? formatLongText(record?.pubkey, 4, 4)}
              </div>
            </div>
          </div>
        );
      }
    },
    {
      title: "Boosts",
      dataIndex: "userStaked",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
            {formatValueDecimal(
              record?.dynamicData?.activeBoostAmount ?? 0,
              "",
              2,
              true,
              false
            )}{" "}
            BGT
          </div>
        );
      }
    },
    {
      title: "Staked",
      dataIndex: "userQueued",
      align: "left",
      width: "17%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
            {formatValueDecimal(
              record?.dynamicData?.stakedBeraAmount ?? 0,
              "",
              2,
              true,
              false
            )}{" "}
            BGT
          </div>
        );
      }
    },
    {
      title: "BGT Emissions (24h)",
      dataIndex: "BGTDelegated",
      align: "left",
      width: "17%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
            {formatValueDecimal(
              record?.dynamicData?.lastDayDistributedBGTAmount ?? 0,
              "",
              2,
              true,
              false
            )}{" "}
            BGT
          </div>
        );
      }
    },
    {
      title: "Boost APY",
      align: "left",
      width: "13%",
      render: (text: string, record: any) => {
        return (
          <div className="text-black font-Montserrat text-[16px] font-medium leading-[90%]">
            -
          </div>
        );
      }
    },
    {
      title: "Incentives",
      dataIndex: "incentives",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        return <div>No Incentives</div>;
      }
    }
  ];
  return (
    <div className="p-[12px]">
      <div className="grid grid-cols-2 ">
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Total Active Validators</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">{pageData?.polGetGlobalInfo?.totalValidatorsCount ?? 0}</div>
        </div>
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Total Boosts</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">{numberFormatter(pageData?.polGetGlobalInfo?.totalActiveBoostAmount, 2, true, { isShort: true })} BGT</div>
        </div>
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Total Bera Staked</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">{numberFormatter(pageData?.polGetGlobalInfo?.totalStakedBeraAmount, 2, true, { isShort: true })} BERA</div>
        </div>
        <div className="">
          <label htmlFor="" className="text-[#3D405A] text-[14px] font-[500]">Total Boosts</label>
          <div className="text-black text-[22px] font-[600] mt-[12px]">{numberFormatter(pageData?.polGetGlobalInfo?.totalActiveIncentivesValueUSD, 2, true, { prefix: "$", isShort: true })}</div>
        </div>
      </div>
      <div className="my-[15px] flex flex-col gap-[8px]">
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
                  className='flex-1 h-[40px] bg-inherit outline-none'
                  placeholder='Search...'
                  onChange={(ev: any) => {
                    handleSearch(ev.target.value)
                  }}
                />
              </div>
            </div>
          )
        }
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
          className="w-full"
          tabClassName="!text-[14px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
      </div>
      {
        (currentTab === "all" || currentTab === "my") && (
          <div className="flex flex-col gap-[8px]">
            {!loading &&
              (filterList?.length > 0 ? (
                filterList?.map((d: any, idx: number) => (
                  <div
                    key={idx}
                    className="w-full flex flex-wrap gap-y-[36px] bg-[rgba(0,0,0,0.06)] rounded-[10px] p-[17px_12px_24px]"
                  >
                    {Columns.map((c: any, index: number) => (
                      <div
                        key={`col-${index}`}
                        className={`${index % 2 === 0 ? "w-[60%]" : "w-[40%]"
                          }`}
                        onClick={() => {
                          router.push("/bgt/validator?id=" + d.id)
                        }}
                      >
                        <div className="text-[#3D405A] font-[500] text-[14px] mb-[5px] whitespace-nowrap">
                          {c.title}
                        </div>
                        {c.render(d[c.dataIndex], d)}
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div className="py-[30px]">
                  <Empty desc="No data" />
                </div>
              ))}
            {loading && (
              <div className="w-full flex flex-col gap-[8px]">
                <Skeleton width="100%" height={300} borderRadius={10} />
                <Skeleton width="100%" height={300} borderRadius={10} />
              </div>
            )}
          </div>
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
