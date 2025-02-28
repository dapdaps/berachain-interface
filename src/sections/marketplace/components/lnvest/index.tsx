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

  const handleInfrared = (record: any, type: any) => {
    openInfrared(record, type).then(() => {
      setVaultsVisible(true);
    });
  };

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
  const [sortDataIndex, setSortDataIndex] = useState("");
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
          : data?.tokens?.length === 2
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
  }, [dataList, sortDataIndex, searchVal, rateKey, checked]);

  const handleMobileAction = (record, type) => {
    console.log(
      openInfrared,
      setVaultsVisible,
      "setVaultsVisible-openInfrared"
    );

    if (record?.platform === "aquabera") {
      openAquaBera(record, type).then(() => {
        setVaultsVisible(true);
      });
    } else {
      openInfrared(record, type).then(() => {
        setVaultsVisible(true);
      });
    }
  };

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
                <div>{record?.tokens?.join("-")}</div>
                {isEarn && (
                  <div className="text-[12px] font-[500] mt-[3px] capitalize">
                    {pool?.protocol || record.name}
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
                pool?.protocol === "BeraSwap"
                  ? "/images/dapps/beraswap.svg"
                  : pool?.protocol === "aquabera"
                    ? "/images/dapps/infrared/aquabera.svg"
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
              {record?.platform === "aquabera"
                ? Big(record?.minApr ?? 0).eq(record?.maxApr ?? 0)
                  ? `${Big(record?.maxApr ?? 0).toFixed(2)}%`
                  : `${Big(record?.minApr ?? 0).toFixed(2)}%-${Big(
                    record?.maxApr ?? 0
                  ).toFixed(2)}%`
                : `${Big(record?.apy ?? 0).toFixed(2)}%`}
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
          // if (record?.platform === "aquabera") {
          //   return (
          //     <svg
          //       width="34"
          //       height="34"
          //       viewBox="0 0 34 34"
          //       fill="none"
          //       xmlns="http://www.w3.org/2000/svg"
          //       className={clsx(
          //         "cursor-pointer",
          //         checkedIndex === index ? "rotate-180" : "rotate-0"
          //       )}
          //       onClick={() => {
          //         setCheckedIndex(
          //           checkedIndex === -1 || checkedIndex !== index ? index : -1
          //         );
          //       }}
          //     >
          //       <rect
          //         x="0.5"
          //         y="0.5"
          //         width="33"
          //         height="33"
          //         rx="10.5"
          //         fill="white"
          //         stroke="#373A53"
          //       />
          //       <path
          //         d="M11 15L17 20L23 15"
          //         stroke="black"
          //         stroke-width="2"
          //         stroke-linecap="round"
          //       />
          //     </svg>
          //   );
          // }
          if (isEarn) {
            return (
              <div className="flex items-center gap-2">
                <Button
                  style={{ width: 32 }}
                  onClick={() => handleInfrared(record, 0)}
                >
                  +
                </Button>
                <Button
                  style={{ width: 32 }}
                  onClick={() => handleInfrared(record, 1)}
                >
                  -
                </Button>
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
          return record?.platform === "aquabera" ? (
            <div className="decoration-solid">
              {formatValueDecimal(record?.usdDepositAmount, "$", 2)}
            </div>
          ) : (
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%] flex items-center gap-[6px]">
              {isValid && (
                <div className="flex items-center">
                  <LazyImage
                    src={record.images[0]}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded-full"
                  />
                  {record.images[1] && (
                    <LazyImage
                      src={record.images[1]}
                      alt=""
                      width={20}
                      height={20}
                      className="rounded-full ml-[-10px] "
                    />
                  )}
                </div>
              )}
              <div
                className="underline decoration-solid"
                style={isValid ? {} : { opacity: 0.3, textDecoration: "none" }}
              >
                {numberFormatter(record.depositAmount, 2, true, {
                  isShort: true
                })}
              </div>
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
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%] flex items-center gap-[6px]">
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
              <div className="" style={isValid ? {} : { opacity: 0.3 }}>
                {numberFormatter(record.earned, 2, true, { isShort: true })}
              </div>
            </div>
          );
        }
      });
    }
    return _columns;
  }, [openInfrared, source]);



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
