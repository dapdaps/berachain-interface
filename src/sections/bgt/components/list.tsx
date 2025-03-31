import List from "@/sections/marketplace/components/list";
import Big from "big.js";

import allTokens from "@/configs/allTokens";
import useCustomAccount from "@/hooks/use-account";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText, getProtocolIcon } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useVaultList } from "../hooks/useList";
import IconArrow from '@public/images/icon-arrow.svg'
const VaultsList = () => {
  const { chainId } = useCustomAccount()
  const router = useRouter()
  const currChainTokens = useMemo(() => allTokens[chainId], [chainId])
  const {
    data,
    loading: isLoading,
    maxPage,
    setPage,
    setSortBy,
  } = useVaultList({
    sortBy: "activeIncentivesInHoney",
    sortOrder: "desc",
  });
  return (
    <List
      loading={isLoading}
      meta={[
        {
          title: "Vaults",
          key: "vaults",
          sort: false,
          width: "35%",
          render: (item: any, index: number) => {
            return (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={item?.metadata?.logoURI ?? "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"}
                    className="w-[30px] h-[30px] bg-[#0d0703] bg-opacity-10 border border-[#0d0703] text-white rounded-full"
                    alt={item?.metadata?.name}
                  />
                  <img
                    src={getProtocolIcon(item?.metadata?.protocolName)}
                    className="w-[16px] h-[16px] absolute bottom-0 right-0"
                    alt=""
                  />
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
          key: "incentiveValue",
          sort: true,
          width: "18%",
          render: (item: any, index: number) => {
            return formatValueDecimal(item?.dynamicData?.activeIncentivesValueUsd ?? 0, "$", 2, false, false);
          },
        },
        {
          title: "BGT APR",
          key: "capture",
          sort: true,
          width: "13%",
          render: (item: any, index: number) => {
            return formatValueDecimal(Big(item?.dynamicData?.apr ?? 0).times(100).toFixed(), '', 2) + "%";
          },
        },
        {
          title: "BGT Capture",
          key: "capture",
          sort: true,
          width: "13%",
          render: (item: any, index: number) => {
            return formatValueDecimal(Big(item?.dynamicData?.bgtCapturePercentage ?? 0).times(100).toFixed(), '', 2) + "%";
          },
        },
        {
          title: "Incentives",
          key: "Incentives",
          sort: false,
          width: "15%",
          render: (item: any, index: number) => {
            return (
              <>
                {item?.activeIncentives?.length > 0 ? item?.activeIncentives?.map((v: any) => {
                  const token = currChainTokens?.find(chainToken => chainToken?.address === v?.token?.address)
                  console.log('===token', token)
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
              </>
            );
          },
        },
        {
          title: "",
          key: "action",
          sort: false,
          width: "6%",
          render: (item: any, index: number) => {
            return (
              <div className="cursor-pointer -rotate-90"
                onClick={() => {
                  router.push("/bgt/gauge?address=" + item.id)
                }}
              >
                <IconArrow />
              </div>
            );
          },
        },
      ]}
      list={data}
      maxPage={maxPage}
      onPageChange={setPage}
      bodyClassName="h-[500px] overflow-y-auto mt-[20px]"
    />
  );
};

export default VaultsList;
