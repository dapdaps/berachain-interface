// @ts-nocheck
import Button from "@/components/button";
import CheckBox from "@/components/check-box";
import FlexTable, { Column } from "@/components/flex-table";
import LazyImage from "@/components/layz-image";
import SwitchTabs from "@/components/switch-tabs";
import useClickTracking from "@/hooks/use-click-tracking";
import useIsMobile from "@/hooks/use-isMobile";
import { MarketplaceContext } from "@/sections/marketplace/context";
import { PairedList } from "@/sections/staking/Bridge/List/AquaBera";
import { formatValueDecimal } from "@/utils/balance";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";
import clsx from "clsx";
import { cloneDeep } from "lodash";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useMemo, useState } from "react";
import Dropdown from "../dropdown";
import SearchBox from "../searchbox";
import useDataList from "./hooks/useDataList";
import Mobile from "./mobile";

export default function Invest(props: any) {
  const { source } = props;

  const searchParams = useSearchParams();

  const { openAquaBera, openInfrared, setVaultsVisible } =
    useContext(MarketplaceContext);
  const { handleReport } = useClickTracking();

  const isMobile = useIsMobile();



  const Tabs: any = [
    { value: "Single", label: "Single Token" },
    { value: "LP", label: "LP" }
  ];

  const typeList = [
    { key: "all", name: "All Types" },
    { key: "lending", name: "Lending" },
    { key: "staking", name: "Staking" },
    { key: "vaults", name: "Vaults" }
  ];

  const [type, setType] = useState(searchParams.get("type") || "all");
  const [rateKey, setRateKey] = useState<"Single" | "LP">("Single");
  const [searchVal, setSearchVal] = useState("");
  const [sortDataIndex, setSortDataIndex] = useState("apy");
  const [sortDataDirection, setSortDataDirection] = useState(1);
  const [updater, setUpdater] = useState(0);
  const [checked, setChecked] = useState(false);
  const { loading, dataList } = useDataList(updater);

  const [checkedIndex, setCheckedIndex] = useState(-1);
  const [checkedRecord, setCheckedRecord] = useState(null);


  const filterList = useMemo(() => {
    let _filterList = dataList
      .filter((data) => (searchVal ? data?.id.indexOf(searchVal) > -1 : true))
      .filter((data) =>
        rateKey === "Single"
          ? (data?.tokens?.length === 1 || data?.platform === "aquabera")
          : data?.tokens?.length === 2 && data?.platform !== "aquabera"
      );
    if (checked) {
      _filterList = _filterList.filter((data) =>
        Big(data?.depositAmount || 0).gt(0)
      );
    }
    return sortDataIndex
      ? cloneDeep(_filterList).sort((prev, next) => {
        return Big(next[sortDataIndex] || 0).gt(prev[sortDataIndex] || 0)
          ? sortDataDirection
          : -sortDataDirection;
      })
      : _filterList;
  }, [dataList, sortDataIndex, sortDataDirection, searchVal, rateKey, checked]);

  const handleMobileAction = (record, type) => {

    if (record?.platform === "aquabera") {
      openAquaBera(record, type, refresh).then(() => {
        setVaultsVisible(true);
      });
    } else {
      openInfrared(record, type, refresh).then(() => {
        setVaultsVisible(true);
      });
    }
  };

  const handleInfrared = (record: any, type: any) => {
    openInfrared(record, type, refresh).then(() => {
      setVaultsVisible(true);
    });
  };

  function refresh() {
    setUpdater(Date.now())
  }
  useEffect(() => {
    isMobile && handleReport("1019-003");
  }, [isMobile]);

  const Columns = useMemo<Column[]>(() => {
    const isEarn = source === "earn";
    const _columns = [
      {
        title: "#",
        dataIndex: "sequence",
        align: "left",
        width: "5%",
        render: (text: string, record: any, index: number) => {
          return <div>{index + 1}</div>;
        }
      },
      {
        title: isEarn ? "Pool" : "Investment",
        dataIndex: "investment",
        align: "left",
        width: "25%",
        render: (text: string, record: any) => {
          const pool = record?.pool;
          const name = pool?.protocol || record.name
          return (
            <div
              className="flex items-center gap-[10px]"
              style={isEarn ? { gap: 20 } : {}}
            >
              <div className="relative flex items-center">
                {record?.images[0] && (
                  <div className="w-[30px] h-[30px] rounded-full">
                    <img src={record?.images[0]} />
                  </div>
                )}
                {record?.images[1] && (
                  <div className="ml-[-10px] w-[30px] h-[30px] rounded-full">
                    <img src={record?.images[1]} />
                  </div>
                )}
                {isEarn && (
                  <img
                    src={`/images/dapps/infrared/${(
                      pool?.protocol ?? "infrared"
                    ).toLocaleLowerCase()}.svg`}
                    alt=""
                    className="w-[16px] h-[16px] rounded-[4px] absolute right-[-2px] bottom-[-2px]"
                  />
                )}
              </div>
              <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">
                <div>{record?.id}</div>
                {isEarn && (
                  <div className="text-[12px] font-[500] mt-[3px]">
                    {name === "aquabera" ? "AquaBera" : name}
                  </div>
                )}
              </div>
            </div>
          );
        }
      },
      {
        title: "Protocol",
        dataIndex: "protocol",
        align: "left",
        width: "15%",
        render: (text: string, record: any) => {
          const pool = record?.pool;
          return (
            <img
              style={{ width: 20 }}
              src={
                pool?.protocol === "Bex"
                  ? "/images/dapps/bex.svg"
                  : pool?.protocol === "aquabera"
                    ? "/images/dapps/infrared/aquabera.png"
                    : pool?.protocol === "Kodiak Finance"
                      ? "/images/dapps/kodiak.svg"
                      : "/images/dapps/infrared/berps.svg"
              }
            />
          );
        }
      },
      {
        title: "Type",
        dataIndex: "type",
        align: "left",
        width: "15%",
        render: (text: string, record: any) => {
          return (
            <div className="flex justify-start">
              <div className="px-[10px] py-[5px] rounded-[12px] border border-[#373A53] bg-white text-black font-Montserrat text-[14px] font-medium leading-[100%]">
                {record?.type}
              </div>
            </div>
          );
        }
      },
      {
        title: "TVL",
        dataIndex: "tvl",
        align: "left",
        width: "15%",
        sort: true,
        render: (text: string, record: any) => {
          return (
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">
              {formatValueDecimal(record?.tvl, "$", 2, true)}
            </div>
          );
        }
      },
      {
        title: "APR",
        dataIndex: "apy",
        align: "left",
        width: "15%",
        sort: true,
        render: (text: string, record: any) => {
          return (
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">
              {Big(record?.apy ?? 0).toFixed(2)}%
            </div>
          );
        }
      },
      {
        title: "Action",
        dataIndex: "action",
        align: "left",
        width: "10%",
        render: (
          text: string,
          record: any,
          index: number,
          checkedIndex: number
        ) => {
          if (record?.platform === "aquabera") {
            const _data = {
              pool: record,
              token0: record?.tokens?.[0],
              token1: record?.tokens?.[1],
            }
            return (
              <div className='flex gap-[10px]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='34'
                  height='34'
                  viewBox='0 0 34 34'
                  fill='none'
                  className='cursor-pointer'
                  onClick={() => {
                    openAquaBera(_data, 0, refresh).then(() => {
                      setVaultsVisible(true);
                    });
                  }}
                >
                  <rect
                    x='0.5'
                    y='0.5'
                    width='33'
                    height='33'
                    rx='10.5'
                    fill='white'
                    stroke='#373A53'
                  />
                  <path
                    d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
                    fill='black'
                  />
                </svg>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='34'
                  height='34'
                  viewBox='0 0 34 34'
                  fill='none'
                  className={
                    Big(record?.yourValue ?? 0).eq(0)
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  }
                  onClick={() => {
                    if (Big(record?.yourValue ?? 0).gt(0)) {
                      openAquaBera(_data, 1, refresh).then(() => {
                        setVaultsVisible(true);
                      });
                    }
                  }}
                >
                  <g opacity={Big(record?.yourValue ?? 0).eq(0) ? '0.3' : '1'}>
                    <rect
                      x='0.5'
                      y='0.5'
                      width='33'
                      height='33'
                      rx='10.5'
                      fill='white'
                      stroke='#373A53'
                    />
                    <rect x='11' y='16' width='13' height='2' rx='1' fill='black' />
                  </g>
                </svg>
              </div>
            );
          }

          console.log('=====record====', record)
          if (isEarn) {
            return (
              <div className="flex items-center gap-2">
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='34'
                  height='34'
                  viewBox='0 0 34 34'
                  fill='none'
                  className='cursor-pointer'
                  onClick={() => handleInfrared(record, 0)}
                >
                  <rect
                    x='0.5'
                    y='0.5'
                    width='33'
                    height='33'
                    rx='10.5'
                    fill='white'
                    stroke='#373A53'
                  />
                  <path
                    d='M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z'
                    fill='black'
                  />
                </svg>

                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='34'
                  height='34'
                  viewBox='0 0 34 34'
                  fill='none'
                  className={
                    Big(record?.depositAmount ?? 0).eq(0)
                      ? 'cursor-not-allowed'
                      : 'cursor-pointer'
                  }
                  onClick={() => Big(record?.depositAmount ?? 0).gt(0) && handleInfrared(record, 1)}
                >
                  <g opacity={Big(record?.depositAmount ?? 0).eq(0) ? '0.3' : '1'}>
                    <rect
                      x='0.5'
                      y='0.5'
                      width='33'
                      height='33'
                      rx='10.5'
                      fill='white'
                      stroke='#373A53'
                    />
                    <rect x='11' y='16' width='13' height='2' rx='1' fill='black' />
                  </g>
                </svg>
              </div>
            );
          }
          return (
            <div
              className="flex items-center justify-center w-[90px] h-[32px] border border-[#373A53] rounded-[10px] text-black font-Montserrat text-[14px] font-medium leading-[100%] bg-white hover:bg-[#FFDC50]"
              onClick={() => handleInfrared(record, 0)}
            >
              Stake
            </div>
          );
        }
      }
    ];
    if (isEarn) {
      _columns.splice(2, 1);
      _columns.splice(3, 1);
      _columns.splice(4, 0, {
        title: "You Staked",
        dataIndex: "depositAmount",
        align: "left",
        width: "15%",
        sort: true,
        render: (text: string, record: any) => {
          const isValid = Big(record.depositAmount || 0).gt(0);

          console.log('====record', record)
          return record?.platform === "aquabera" ? (
            isValid ? (
              <div className="decoration-solid">
                {numberFormatter(record?.usdDepositAmount, 2, true, {
                  prefix: '$',
                  isShort: true
                })}
              </div>
            ) : (
              <div className="opacity-30">
                $0.00
              </div>
            )
          ) : (
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%] flex items-center gap-[6px]">
              {isValid && (
                <div className="flex items-center">

                  {
                    record.images[0] && (
                      <div className="w-[20px] rounded-full overflow-hidden">
                        <img src={record.images[0]} alt="icon_0" />
                      </div>
                    )
                  }
                  {
                    record.images[1] && (
                      <div className="w-[20px] rounded-full overflow-hidden ml-[-10px]">
                        <img src={record.images[1]} alt="icon_1" />
                      </div>
                    )
                  }
                </div>
              )}
              {
                isValid ? (
                  <div className="underline decoration-solid">
                    {numberFormatter(record.depositAmount, 2, true, {
                      isShort: true
                    })}
                  </div>
                ) : (
                  <div className="opacity-30">
                    $0.00
                  </div>
                )
              }
            </div>
          );
        }
      });
      _columns.splice(5, 0, {
        title: "Rewards",
        dataIndex: "earned",
        align: "left",
        width: "15%",
        render: (text: string, record: any) => {
          const isValid = Big(record.earned || 0).gt(0);
          return (
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">
              {
                isValid ? (
                  <div className="flex items-center gap-[6px]">
                    {record?.initialData?.reward_tokens?.[0]?.icon && (
                      <div className="flex items-center">
                        <LazyImage
                          src={record?.initialData?.reward_tokens?.[0]?.icon}
                          alt=""
                          width={20}
                          height={20}
                          className="rounded-full"
                        />
                      </div>
                    )}
                    {record?.platform === "aquabera" ? "-" : numberFormatter(record.earned, 2, true, { isShort: true })}
                  </div>

                ) : (
                  <div className="opacity-30">
                    $0.00
                  </div>
                )
              }
            </div>
          );
        }
      });
    }
    return _columns;
  }, [openInfrared, source,]);



  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px] lg:justify-between lg:w-full">
          <div className="flex gap-2 items-center lg:p-4">
            <div className="hidden lg:block font-Montserrat text-[26px] font-bold leading-[23px] text-left mr-[20px]">
              Staking
            </div>
            <SwitchTabs
              tabs={Tabs}
              current={rateKey}
              onChange={(tab) => {
                setRateKey(tab);
              }}
              style={{
                width: 188,
                height: 40,
                padding: 4
              }}
              tabStyle={{
                fontWeight: 500,
                fontSize: 12
              }}
            />
          </div>
          {!isMobile && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-[8px]">
                <CheckBox
                  checked={checked}
                  onClick={() => {
                    setChecked(!checked);
                  }}
                />
                <div>You Added only</div>
              </div>
              <Dropdown
                list={typeList}
                value={type}
                onChange={(val) => {
                  setType(val);
                }}
                placeholder=""
              />
              <SearchBox value={searchVal} onChange={setSearchVal} />
            </div>
          )}
        </div>
        {isMobile && (
          <div className="flex items-center gap-[8px]">
            <div>You Added only</div>
            <CheckBox
              checked={checked}
              onClick={() => {
                setChecked(!checked);
              }}
            />
          </div>
        )}
      </div>
      {isMobile ? (
        <Mobile
          filterList={filterList}
          loading={loading}
          onClick={handleMobileAction}
        />
      ) : (
        <FlexTable
          loading={loading}
          columns={Columns}
          list={filterList}
          sortDataIndex={sortDataIndex}
          sortDataDirection={sortDataDirection}
          checkedIndex={checkedIndex}
          onChangeSortDataIndex={(index) => {
            setSortDataIndex(index);
            if (index === sortDataIndex) {
              setSortDataDirection(-sortDataDirection);
            }
          }}
        />
      )}
    </div>
  );
}
