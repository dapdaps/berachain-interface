import FlexTable, { Column } from "@/components/flex-table";
import SwitchTabs from '@/components/switch-tabs';
import { useBGT } from "@/hooks/use-bgt";
import useValidator from "@/hooks/use-validator";
import useValidatorVaults from "@/hooks/use-validator-vaults";
import BgtHead from '@/sections/bgt/components/bgt-head';
import { formatValueDecimal } from "@/utils/balance";
import Big from "big.js";
import clsx from "clsx";
import { useRouter, useSearchParams } from 'next/navigation';
import { memo, useEffect, useMemo, useState } from "react";
import Delegate from "./components/delegate";
import { VALIDATORS } from "./config";
import { OperationTypeType, ValidatorType } from "./types";

const BTN_CLASS = "cursor-pointer flex items-center justify-center w-[203px] h-[46px] rounded-[10px] border border-black bg-white text-black text-[16px] font-Montserrat font-semibold"
export default memo(function validator() {
  const router = useRouter()
  const searchParams = useSearchParams();
  const {
    data: bgtData,
  } = useBGT();

  const {
    loading: vaultsLoading,
    vaults,
    getValuts
  } = useValidatorVaults()
  const {
    loading: validatorLoading,
    pageData,
    getPageData
  } = useValidator()

  const address = searchParams.get("address")
  const [currentTab, setCurrentTab] = useState("gauges")
  const [visible, setVisible] = useState(false)
  const validator = useMemo(() => VALIDATORS.find((validator: ValidatorType) => validator?.address === address), [address])


  const [operationType, setOperationType] = useState<OperationTypeType>("delegate")
  const Tabs: any = [
    { value: "gauges", label: "Gauges" },
    { value: "Incentives", label: "incentives" },
  ];
  const Columns: Column[] = [
    {
      title: "Gauge Vaults",
      dataIndex: "vaults",
      align: "left",
      width: "25%",
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[16px]">
            <div className="relative">
              <div className="w-[30px] h-[30px]">
                <img src={record?.metadata?.logoURI} alt={record?.metadata?.name} />
              </div>
              <div className="absolute right-[-7px] bottom-[-1px] w-[16px] h-[16px]">
                <img src={record?.metadata?.productMetadata?.logoURI} alt={record?.metadata?.productMetadata?.name} />
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.metadata?.name}</div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">{record?.metadata?.product}</div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Total Incentive Value",
      dataIndex: "incentive",
      align: "left",
      width: "25%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.amountStaked}</div>;
      },
    },
    {
      title: "BGT per Proposal",
      dataIndex: "proposal",
      align: "left",
      width: "25%",
      render: (text: string, record: any) => {
        return <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">{record?.amountStaked} BGT</div>;
      },
    },
    {
      title: "Incentives",
      dataIndex: "incentives",
      align: "left",
      width: "25%",
      render: (text: string, record: any) => {
        return record?.activeIncentives?.length > 0 ? (
          <div>No Incentives</div>
        ) : (
          <div>Incentives</div>
        );
      },
    },

  ];

  const handleClose = () => {
    setVisible(false)
  }
  const handleClick = (type: operationType) => {
    setVisible(true)
    setOperationType(type)
  }

  useEffect(() => {
    if (address) {
      getPageData(address)
      getValuts(address)
    }
  }, [address])

  return (
    <div className="flex flex-col items-center pt-[75px]">
      <BgtHead bgtData={bgtData} />

      <div className="w-[1200px] p-[30px] rounded-[20px] border border-black bg-[#FFFDEB] shadow-[10px_10px_0_0_rgba(0,0,0,0.25)">
        <div className="flex items-start justify-between h-[146px] rounded-[20px] bg-[#FFDC50]">

          <div
            className="cursor-pointer mt-[15px] ml-[19px] mr-[34px]"
            onClick={() => {
              router.back()
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 34 34" fill="none">
              <rect x="0.5" y="0.5" width="33" height="33" rx="10.5" fill="white" stroke="#373A53" />
              <path d="M20 11L15.2 17L20 23" stroke="black" stroke-width="3" stroke-linecap="round" />
            </svg>
          </div>
          <div className="flex-1 mt-[11px] mr-[69px]">
            <div className="flex items-center gap-[17px]">
              <div className="w-[40px] h-[40px] rounded-[20px] border border-black overflow-hidden">
                <img src={pageData?.metadata?.logoURI} alt={pageData?.metadata?.name} />
              </div>
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">
                {pageData?.metadata?.name}
              </div>
            </div>
            <div className="flex items-center justify-between mt-[24px]">
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">APY</div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(pageData?.apy ?? 0).div(100).toFixed(2)}%</div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">BGT delegated</div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.amountStaked ?? 0, '', 2, true)} BGT</div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Commission</div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(pageData?.commission ?? 0).times(100).toFixed(2)} %</div>
              </div>
              <div className="flex flex-col gap-[12px]">
                <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Website</div>
                <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{pageData?.metadata?.website}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-[12px] mt-[26px] mr-[26px]">
            <div
              className={BTN_CLASS}
              onClick={() => {
                handleClick("delegate")
              }}
            >
              Delegate +
            </div>
            <div
              className={clsx(BTN_CLASS, "!bg-transparent border-black/50")}
              onClick={() => {
                handleClick("unbond")
              }}
            >
              Unbond -
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-[28px] mt-[24px] mb-[48px]">
          <div className="flex items-center">
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Active Gauges Vaults</div>
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">1</span>
                <div className="w-[30px] h-[30px]">
                  <img src={vaults?.[0]?.metadata?.logoURI} alt={vaults?.[0]?.metadata?.name} />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Active Incentives</div>
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">0</div>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Reward Rate</div>
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{Big(pageData?.rewardRate ?? 0).toFixed(2)}</span>
                <div className="w-[20px] h-[20px]">
                  <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Return per BGT</div>
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">1</span>
                <div className="w-[20px] h-[20px]">
                  <img src="/images/dapps/infrared/honey.svg" alt="honey" />
                </div>
              </div>
            </div>
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Lifetime Incentives</div>
              <div className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.allTimeData?.allTimeHoneyValueTokenRewards, '', 2, true)}</div>
            </div>
            <div className="flex-1 flex flex-col gap-[10px]">
              <div className="text-[#3D405A] font-Montserrat text-[14px] font-medium">Lifetime BGT Directed</div>
              <div className="flex items-center gap-[6px]">
                <span className="text-black font-Montserrat text-[20px] font-semibold leading-[90%]">{formatValueDecimal(pageData?.allTimeData?.allTimeBgtDirected, '', 2, true)}</span>
                <div className="w-[20px] h-[20px]">
                  <img src="/images/dapps/infrared/bgt.svg" alt="bgt" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <SwitchTabs
          currentTab={currentTab}
          tabs={Tabs}
          onChange={(key) => setCurrentTab(key as string)}
          style={{
            width: 340,
            height: 40,
            padding: 4,
          }}
          tabStyle={{
            fontWeight: 500,
            fontSize: 14,
          }}
        />


        <FlexTable
          loading={vaultsLoading}
          columns={Columns}
          list={vaults}
        />
      </div>
      <Delegate
        visible={visible}
        validator={validator}
        operationType={operationType}
        onClose={handleClose}
      />
    </div>
  )
})
