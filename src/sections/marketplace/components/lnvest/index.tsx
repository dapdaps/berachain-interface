// @ts-nocheck
import FlexTable, { Column } from "@/components/flex-table";
import SwitchTabs from "@/components/switch-tabs";
import { MarketplaceContext } from "@/sections/marketplace/context";
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import _ from "lodash";
import { useMemo, useState, useContext, useCallback } from "react";
import Dropdown from "../dropdown";
import SearchBox from "../searchbox";
import useDataList from "./hooks/useDataList";
import BendLending from "../dapps/bendLending";
import { useSearchParams } from "next/navigation";
import useIsMobile from "@/hooks/use-isMobile";
import CheckBox from "@/components/check-box";
import Mobile from "./mobile";

export default function Invest() {
  const searchParams = useSearchParams();

  const {
    // lendingVisible,
    // setLendingVisible,
    // lendingData,
    openInfrared,
    setVaultsVisible,
  } = useContext(MarketplaceContext);

  const isMobile = useIsMobile();

  const Columns: Column[] = [
    {
      title: "#",
      dataIndex: "sequence",
      align: "left",
      width: "5%",
      render: (text: string, record: any, index: number) => {
        return <div>{index + 1}</div>;
      },
    },
    {
      title: "Investment",
      dataIndex: "investment",
      align: "left",
      width: "25%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center">
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
            </div>
            <div className="text-black font-Montserrat text-[16px] font-medium leading-[100%]">
              {record?.tokens?.join("-")}
            </div>
          </div>
        );
      },
    },
    {
      title: "Protocol",
      dataIndex: "protocol",
      align: "left",
      width: "15%",
      render: (text: string, record: any) => {
        const pool = record?.initialData?.pool;
        return (
          <img
            style={{ width: 20 }}
            src={`/images/dapps/infrared/${(
              pool?.protocol ?? "infrared"
            ).toLocaleLowerCase()}.svg`}
          />
        );
      },
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
      },
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
      },
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
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
      width: "10%",
      render: (text: string, record: any) => {
        return (
          <div
            className="flex items-center justify-center w-[90px] h-[32px] border border-[#373A53] rounded-[10px] text-black font-Montserrat text-[14px] font-medium leading-[100%] bg-white hover:bg-[#FFDC50]"
            onClick={() => {
              openInfrared(record).then(() => {
                console.log("====1111====");
                setVaultsVisible(true);
              });
            }}
          >
            Stake
          </div>
        );
      },
    },
  ];
  const Tabs: any = [
    { value: "Single", label: "Single Token" },
    { value: "LP", label: "LP" },
  ];

  const typeList = [
    { key: "all", name: "All Types" },
    { key: "lending", name: "Lending" },
    { key: "staking", name: "Staking" },
    { key: "vaults", name: "Vaults" },
  ];

  const [type, setType] = useState(searchParams.get("type") || "all");
  const [rateKey, setRateKey] = useState<"Single" | "LP">("Single");
  const [searchVal, setSearchVal] = useState("");
  const [sortDataIndex, setSortDataIndex] = useState("");
  const [updater, setUpdater] = useState(0);
  const [checked, setChecked] = useState(false);
  const { loading, dataList } = useDataList(updater);
  const filterList = useMemo(() => {
    const _filterList = dataList
      .filter((data) => (searchVal ? data?.id.indexOf(searchVal) > -1 : true))
      .filter((data) =>
        rateKey === "Single"
          ? data?.tokens?.length === 1
          : data?.tokens?.length === 2
      );
    return sortDataIndex
      ? _.cloneDeep(_filterList).sort((prev, next) =>
          Big(next[sortDataIndex]).minus(prev[sortDataIndex]).toFixed()
        )
      : _filterList;
  }, [dataList, sortDataIndex, searchVal, rateKey]);


  const handleMobileAction = (record) => {
    console.log(openInfrared,setVaultsVisible, 'setVaultsVisible-openInfrared');

    openInfrared(record).then(() => {
      console.log("====1111====", record);
      setVaultsVisible(true);
    });
  }


  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[16px] lg:justify-between lg:w-full">
          <div className='flex gap-2 items-center lg:p-4'>
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
                padding: 4,
              }}
              tabStyle={{
                fontWeight: 500,
                fontSize: 12,
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
        <Mobile filterList={filterList} loading={loading} onClick={handleMobileAction} />
      ) : (
        <FlexTable
          loading={loading}
          columns={Columns}
          list={filterList}
          sortDataIndex={sortDataIndex}
          onChangeSortDataIndex={(index) => {
            setSortDataIndex(sortDataIndex === index ? "" : index);
          }}
        />
      )}
    </div>
  );
}
