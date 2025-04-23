import List from "@/sections/marketplace/components/list";
import Big from "big.js";

import allTokens from "@/configs/allTokens";
import useCustomAccount from "@/hooks/use-account";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText, getProtocolIcon } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVaultList } from "../hooks/useList";
import IconArrow from '@public/images/icon-arrow.svg'
import FlexTable from "@/components/flex-table";
import Pager from "@/components/pager";
const VaultsList = ({
  value
}: {
  value: string
}) => {
  const router = useRouter()
  const currChainTokens = useMemo(() => allTokens["80094"], [allTokens])

  const [sortDataIndex, setSortDataIndex] = useState("apy");
  const [sortDataDirection, setSortDataDirection] = useState(1);

  const pagerRef = useRef(null)
  const {
    data,
    loading: isLoading,
    maxPage,
    setPage,
    setSortBy,
    setQuery
  } = useVaultList({
    sortBy: "apr",
    sortOrder: "desc",
  });

  const Columns = [{
    title: "Vaults",
    dataIndex: "vaults",
    sort: false,
    width: "35%",
    render: (text: string, item: any, index: number) => {
      return (
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={item?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
              className="w-[30px] h-[30px] bg-[#0d0703] bg-opacity-10 border border-[#0d0703] text-white rounded-full"
              alt={item?.metadata?.name}
            />
            {/* <img
              src={getProtocolIcon(item?.metadata?.protocolName)}
              className="w-[16px] h-[16px] absolute bottom-0 right-0"
              alt=""
            /> */}
          </div>
          <div className="flex flex-col">
            <div className="text-[16px] font-[600]">
              {item?.metadata?.name ?? formatLongText(item?.id, 4, 4)}
            </div>
            <div className="text-[10px] font-[400]">
              {item?.metadata?.protocolName}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    title: "Total Incentive Value",
    dataIndex: "activeIncentivesValueUsd",
    sort: true,
    width: "18%",
    render: (text: string, item: any, index: number) => {
      return formatValueDecimal(item?.dynamicData?.activeIncentivesValueUsd ?? 0, "$", 2, false, false);
    },
  },
  {
    title: "BGT APR",
    dataIndex: "apr",
    sort: true,
    width: "13%",
    render: (text: string, item: any, index: number) => {
      return formatValueDecimal(Big(item?.dynamicData?.apr ?? 0).times(100).toFixed(), '', 2) + "%";
    },
  },
  {
    title: "BGT Capture",
    dataIndex: "bgtCapturePercentage",
    sort: true,
    width: "13%",
    render: (text: string, item: any, index: number) => {
      return formatValueDecimal(Big(item?.dynamicData?.bgtCapturePercentage ?? 0).times(100).toFixed(), '', 2) + "%";
    },
  },
  {
    title: "Incentives",
    dataIndex: "Incentives",
    sort: false,
    width: "15%",
    render: (text: string, item: any, index: number) => {
      return (
        <div className="flex items-center">
          {item?.activeIncentives?.length > 0 ? item?.activeIncentives?.map((v: any) => {
            const token = currChainTokens?.find(chainToken => chainToken?.address === v?.token?.address)
            return (
              <div className="w-6 h-6 overflow-hidden shrink-0 rounded-full ml-[-5px]">
                {token?.icon ? (
                  <img src={token?.icon} alt={token?.symbol} />
                ) : (
                  <div className="flex items-center justify-center w-full h-full rounded-full  bg-[#1f1c19] text-[#eae8e6] text-[8px] font-medium">
                    {v.token.symbol}
                  </div>
                )}
              </div>
            )
          }) : "No Incentives"}
        </div>
      );
    },
  },
  {
    title: "",
    dataIndex: "action",
    sort: false,
    width: "6%",
    render: (text: string, item: any, index: number) => {
      return (
        <div className="flex items-center justify-center">

          <div className="cursor-pointer -rotate-90"
            onClick={() => {
              router.push("/bgt/gauge?address=" + item.id)
            }}
          >
            <IconArrow />
          </div>
        </div>
      );
    },
  }]


  useEffect(() => {
    setQuery(value)
  }, [value])

  return (
    <>
      <FlexTable
        loading={isLoading}
        columns={Columns}
        list={data}
        sortDataIndex={sortDataIndex}
        sortDataDirection={sortDataDirection}
        onChangeSortDataIndex={(index) => {
          setSortDataIndex(index);
          setSortDataDirection(-sortDataDirection);
          setSortBy(index, -sortDataDirection > 0 ? "desc" : "asc")
          pagerRef?.current?.setCurrentPage(1)
        }}

      />
      <div className="flex justify-end mt-[30px]">
        <Pager ref={pagerRef} maxPage={maxPage} onPageChange={setPage} />
      </div>
    </>

  );
};

export default VaultsList;
