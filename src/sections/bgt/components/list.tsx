import List from "@/sections/marketplace/components/list";
import { addThousandSeparator } from "@/utils/number-formatter";
import Big from "big.js";

import { useVaultList } from "../hooks/useList";
import { useRouter } from "next/navigation";
const VaultsList = () => {
  const router = useRouter()
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
          width: "20%",
          render: (item: any, index: number) => {
            return (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img
                    src={item.metadata.logoURI || "/images/bgt-logo.svg"}
                    className="w-[30px] h-[30px] bg-[#0d0703] bg-opacity-10 border border-[#0d0703] text-white rounded-full"
                    alt=""
                  />
                  <img
                    src={
                      item.metadata.productMetadata.logoURI ||
                      "/images/bgt-logo-1.svg"
                    }
                    className="w-[16px] h-[16px] absolute bottom-0 right-0"
                    alt=""
                  />
                </div>
                <div className="flex flex-col">
                  <div className="text-[16px] font-[600]">
                    {item.metadata.name}
                  </div>
                  <div className="text-[10px] font-[400]">
                    {item.metadata.product}
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
          width: "35%",
          render: (item: any, index: number) => {
            return (
              "$" +
              addThousandSeparator(item.activeIncentivesInHoney.toFixed(2))
            );
          },
        },
        {
          title: "BGT Capture",
          key: "capture",
          sort: true,
          width: "15%",
          render: (item: any, index: number) => {
            return Big(item.bgtInflationCapture).div(100).toFixed(2) + "%";
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
                {item.activeIncentives.map((v: any) => (
                  <div className="w-fit rounded-lg border p-1">
                    <span className="text-[10px]">{v.token.symbol}</span>
                  </div>
                ))}
              </>
            );
          },
        },

        {
          title: "Deposit Receipt Token",
          key: "action",
          sort: false,
          width: "15%",
          render: (item: any, index: number) => {
            return (
              <div className="cursor-pointer underline text-[16px] font-Montserrat"
                onClick={() => {
                  router.push("/bgt/gauge?address=" + item.id)
                }}
              >
                {/* {item.activeIncentives.map((v: any) => (
                  <div className="w-fit rounded-lg border p-1">
                    <span className="text-[10px]">{v.token.symbol}</span>
                  </div>
                ))} */}
                Deposit
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
