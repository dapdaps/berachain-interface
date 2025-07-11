"use client";

import FlexTable, { Column } from "@/components/flex-table";
import Loading from "@/components/loading";
import SwitchTabs from "@/components/switch-tabs";
import { useBGT } from "@/hooks/use-bgt";
import Select from "@/sections/bgt/components/delegate/select";
import { formatValueDecimal } from "@/utils/balance";
import { formatLongText, getProtocolIcon } from "@/utils/utils";
import Big from "big.js";
import { useRouter } from "next/navigation";
import { memo, useMemo, useState } from "react";
import BgtEmpty from "./components/bgt-empty";
import VaultsList from "./components/list";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import Card from "@/components/card";
import { numberFormatter } from "@/utils/number-formatter";
import _ from "lodash";
import TopValidator from "./components/top-validator";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <Card>
        <div className="flex gap-[8px]">
          <div
            className="w-[4px] h-[72px] rounded-[2px]"
            style={{ backgroundColor: data?.color }}
          ></div>
          <div className="flex flex-col justify-between">
            <div className="text-black">
              {numberFormatter(data?.payload?.value, 2, true)}%
            </div>
            <div className="flex items-center gap-2">
              {data?.name?.indexOf("Others") > -1 ? (
                <></>
              ) : (
                <div className="relative">
                  <img
                    src={
                      data?.metadata?.logoURI ??
                      "https://res.cloudinary.com/duv0g402y/image/upload/v1739449352/validators/icons/hm89bhgw1h2eydgtrmeu.png"
                    }
                    className="min-w-[30px] w-[30px] h-[30px] bg-[#0d0703] bg-opacity-10 border border-[#0d0703] text-white rounded-full"
                    alt={data?.metadata?.name}
                  />
                  {/* <img
                      src={getProtocolIcon(data?.metadata?.protocolName)}
                      className="w-[16px] h-[16px] absolute bottom-0 right-0"
                      alt=""
                    /> */}
                </div>
              )}
              <div className="flex flex-col justify-between items-stretch">
                <div className="text-[16px] font-[600] whitespace-nowrap">
                  {data?.name}
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
  const router = useRouter();
  const [tab, setTab] = useState("all");
  const [selectVisible, setSelectVisible] = useState(false);
  const Columns: Column[] = [
    {
      title: "Vaults",
      dataIndex: "Vaults",
      align: "left",
      width: "30%",
      render: (text: string, record: any) => {
        const vault = record?.vault;
        return (
          <div className="flex items-center gap-[16px]">
            <div className="relative">
              <div className="w-[30px] h-[30px] rounded-full">
                <img src={vault?.metadata?.logoURI ?? "/images/bgt-logo.svg"} />
              </div>
              <div className="absolute right-[-6px] bottom-[-2px] w-[16px]">
                <img src={getProtocolIcon(vault?.metadata?.protocolName)} />
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className="text-black font-Montserrat text-[16px] font-semibold leading-[90%]">
                {vault?.metadata?.name
                  ? vault?.metadata?.name
                  : formatLongText(vault?.id, 4, 4)}
              </div>
              <div className="text-black font-Montserrat text-[12px] font-medium leading-[90%]">
                {vault?.metadata?.protocolName ?? "OTHER"}
              </div>
            </div>
          </div>
        );
      }
    },

    {
      title: "Amount Deposited",
      dataIndex: "depositedAmount",
      align: "left",
      width: "30%",
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className="flex justify-start">
            <div className="px-[10px] py-[5px] rounded-[12px] border border-[#373A53] bg-white text-black font-Montserrat text-[14px] font-medium leading-[100%]">
              {formatValueDecimal(record?.depositedAmount, "", 2)}
            </div>
          </div>
        );
      }
    },
    {
      title: "BGT Rewards",
      dataIndex: "earned",
      align: "left",
      width: "20%",
      sort: true,
      render: (text: string, record: any) => {
        return (
          <div className="flex items-center gap-[6px]">
            <div className="w-[26px] h-[26px] rounded-full">
              <img src="/images/dapps/infrared/bgt.svg" />
            </div>
            <div className="text-[#7EA82B] font-Montserrat text-[16px] font-medium leading-[100%]">
              {formatValueDecimal(record?.earned ?? 0, "", 2)}
            </div>
          </div>
        );
      }
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "left",
      width: "20%",
      render: (text: string, record: any, index) => {
        return (
          <button
            disabled={Big(record?.earned || 0).lte(0) || record?.claiming}
            className="flex items-center justify-center w-[90px] h-[32px] border border-[#373A53] rounded-[10px] text-black font-Montserrat text-[14px] font-medium leading-[100%] bg-white hover:bg-[#FFDC50] disabled:opacity-30"
            onClick={() => record?.claim?.(record, index)}
          >
            {record.claiming ? <Loading /> : "Claim BGT"}
          </button>
        );
      }
    }
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
    handleValidator
  } = useBGT(tab);

  const [value, setValue] = useState("");

  function stringToHslColor(str: string, saturation = 70, lightness = 60) {
    let hash = 0;
    for (let i = 0; i < str?.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360; // 0-359
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }
  const ChartsData = useMemo(() => {
    const firstArray = vaults?.slice(0, 10);
    const secondArray = vaults?.slice(10);
    const array = firstArray.map((vault: any) => {
      const name = vault?.metadata?.name
        ? vault?.metadata?.name
        : formatLongText(vault?.id, 4, 4);
      return {
        name,
        value: +Big(vault?.dynamicData?.bgtCapturePercentage ?? 0)
          .times(100)
          .toFixed(),
        metadata: vault?.metadata,
        color: stringToHslColor(name)
      };
    });
    const othersName = `Others（${secondArray.length}）`;
    const othersValue = secondArray.reduce(
      (acc: any, curr: any) =>
        Big(acc).plus(curr?.dynamicData?.bgtCapturePercentage).toFixed(),
      0
    );
    array.push({
      name: othersName,
      value: +Big(othersValue).times(100).toFixed(),
      color: stringToHslColor(othersName)
    });
    return array;
  }, [vaults]);
  const BgtDistributed = useMemo(
    () =>
      vaults?.reduce(
        (acc: any, curr: any) =>
          Big(acc)
            .plus(curr?.dynamicData?.allTimeReceivedBGTAmount ?? 0)
            .toFixed(),
        0
      ),
    [vaults]
  );

  return (
    <div className="w-[1140px]">
      <div className="flex items-center h-[223px] rounded-[20px] bg-[#FFDC50]">
        <div className="relative h-full flex flex-col flex-[0.8] py-[34px] pl-[30px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Active Reward Vaults</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">
              {pageData?.polGetGlobalInfo?.totalActiveRewardVaults}
            </div>
          </div>
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Active Incentives</div>
            <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">
              {formatValueDecimal(
                pageData?.polGetGlobalInfo?.sumAllIncentivesInHoney,
                "$",
                2,
                true,
                false
              )}
            </div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="relative h-full flex flex-col flex-1 py-[34px] px-[15px] justify-between">
          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Est. Yearly BGT Distribution</div>
            <div className="flex items-center gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="25"
                  height="25"
                  rx="12.5"
                  fill="#FCBE24"
                  stroke="black"
                />
                <path
                  d="M18.2975 15.0349C18.9646 15.9048 19.1045 16.8502 18.7171 17.8715C18.3297 18.8927 17.5609 19.5626 16.4109 19.8811C15.8609 20.0334 15.2998 20.0394 14.7277 19.899C14.1556 19.7587 13.6867 19.4931 13.3209 19.1023C11.9942 19.6806 10.7478 19.6523 9.58166 19.0174C8.41553 18.3824 7.71474 17.3505 7.47938 15.9218C6.89895 15.7838 6.40563 15.5117 5.99941 15.1057C5.59321 14.6998 5.30023 14.1877 5.1205 13.5696C4.83198 12.5773 5.06156 11.6481 5.80924 10.782C6.55692 9.91582 7.42448 9.5394 8.41192 9.65255L10.1465 9.85772C10.3332 9.26109 10.6554 8.72806 11.1132 8.25861C11.5711 7.78906 12.1119 7.45034 12.7358 7.2424L12.3669 5.97365C12.3054 5.76219 12.3254 5.56771 12.4268 5.39021C12.5283 5.21272 12.6874 5.09397 12.9041 5.03396C13.1207 4.97396 13.32 4.99346 13.5019 5.09249C13.6838 5.19152 13.8055 5.34676 13.867 5.55821L14.2926 7.02216C14.9614 7.0303 15.5513 7.1701 16.0625 7.44157C16.5736 7.71304 17.0702 8.15113 17.5522 8.75586L19.0023 8.35422C19.219 8.29424 19.4183 8.31373 19.6001 8.41279C19.782 8.51177 19.9037 8.66706 19.9652 8.87849C20.0267 9.08999 20.0067 9.28443 19.9052 9.46195C19.8038 9.6394 19.6447 9.75819 19.428 9.81817L18.128 10.1782C18.2743 10.8055 18.2714 11.4304 18.1191 12.0525C17.9668 12.6747 17.6797 13.22 17.2576 13.6883L18.2975 15.0349ZM12.2675 17.3376C12.1397 16.8985 12.0531 16.461 12.0075 16.0255C11.9619 15.59 11.9573 15.1562 11.9938 14.7243C11.6624 15.0094 11.2866 15.2497 10.8662 15.4452C10.4458 15.6407 10.0142 15.7822 9.57139 15.8698C9.75586 16.5041 10.0888 16.9523 10.5702 17.2144C11.0517 17.4766 11.6174 17.5176 12.2675 17.3376ZM9.2538 13.8486C9.78716 13.7009 10.2392 13.5054 10.6096 13.2622C10.9802 13.019 11.4337 12.6122 11.9702 12.0417L8.61525 11.6527C8.07517 11.5913 7.66383 11.7096 7.38127 12.0076C7.0987 12.3055 7.02128 12.6741 7.14898 13.1133C7.27196 13.5362 7.5035 13.806 7.84361 13.9227C8.18371 14.0395 8.65377 14.0147 9.2538 13.8486ZM15.8433 17.9292C16.26 17.8138 16.5561 17.5779 16.7317 17.2218C16.9073 16.8656 16.8834 16.5514 16.6602 16.2793L14.3453 13.3349C14.18 13.9431 14.0855 14.5317 14.0618 15.1007C14.0381 15.6697 14.0878 16.1656 14.2108 16.5885C14.3669 17.1253 14.5821 17.5095 14.8566 17.7411C15.1311 17.9726 15.46 18.0353 15.8433 17.9292ZM15.9184 12.0556C16.0377 11.8468 16.1084 11.5943 16.1304 11.2983C16.1523 11.0022 16.1208 10.7077 16.0356 10.415C15.8843 9.89444 15.5815 9.50369 15.1275 9.24277C14.6734 8.98185 14.188 8.92296 13.6713 9.06603C13.3713 9.14912 13.1021 9.27644 12.8638 9.44786C12.6255 9.61935 12.4407 9.81989 12.3094 10.0496L14.5149 10.3879L15.9184 12.0556Z"
                  fill="#451D07"
                />
              </svg>
              <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%] whitespace-nowrap">
                {formatValueDecimal(
                  pageData?.polGetGlobalInfo?.annualizedBGTEmission,
                  "",
                  2,
                  true
                )}{" "}
                Yearly
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[12px]">
            <div className="text-[#3D405A]">Total Circulating BGT</div>
            <div className="flex items-center gap-[10px]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
              >
                <rect
                  x="0.5"
                  y="0.5"
                  width="25"
                  height="25"
                  rx="12.5"
                  fill="#FCBE24"
                  stroke="black"
                />
                <path
                  d="M18.2975 15.0349C18.9646 15.9048 19.1045 16.8502 18.7171 17.8715C18.3297 18.8927 17.5609 19.5626 16.4109 19.8811C15.8609 20.0334 15.2998 20.0394 14.7277 19.899C14.1556 19.7587 13.6867 19.4931 13.3209 19.1023C11.9942 19.6806 10.7478 19.6523 9.58166 19.0174C8.41553 18.3824 7.71474 17.3505 7.47938 15.9218C6.89895 15.7838 6.40563 15.5117 5.99941 15.1057C5.59321 14.6998 5.30023 14.1877 5.1205 13.5696C4.83198 12.5773 5.06156 11.6481 5.80924 10.782C6.55692 9.91582 7.42448 9.5394 8.41192 9.65255L10.1465 9.85772C10.3332 9.26109 10.6554 8.72806 11.1132 8.25861C11.5711 7.78906 12.1119 7.45034 12.7358 7.2424L12.3669 5.97365C12.3054 5.76219 12.3254 5.56771 12.4268 5.39021C12.5283 5.21272 12.6874 5.09397 12.9041 5.03396C13.1207 4.97396 13.32 4.99346 13.5019 5.09249C13.6838 5.19152 13.8055 5.34676 13.867 5.55821L14.2926 7.02216C14.9614 7.0303 15.5513 7.1701 16.0625 7.44157C16.5736 7.71304 17.0702 8.15113 17.5522 8.75586L19.0023 8.35422C19.219 8.29424 19.4183 8.31373 19.6001 8.41279C19.782 8.51177 19.9037 8.66706 19.9652 8.87849C20.0267 9.08999 20.0067 9.28443 19.9052 9.46195C19.8038 9.6394 19.6447 9.75819 19.428 9.81817L18.128 10.1782C18.2743 10.8055 18.2714 11.4304 18.1191 12.0525C17.9668 12.6747 17.6797 13.22 17.2576 13.6883L18.2975 15.0349ZM12.2675 17.3376C12.1397 16.8985 12.0531 16.461 12.0075 16.0255C11.9619 15.59 11.9573 15.1562 11.9938 14.7243C11.6624 15.0094 11.2866 15.2497 10.8662 15.4452C10.4458 15.6407 10.0142 15.7822 9.57139 15.8698C9.75586 16.5041 10.0888 16.9523 10.5702 17.2144C11.0517 17.4766 11.6174 17.5176 12.2675 17.3376ZM9.2538 13.8486C9.78716 13.7009 10.2392 13.5054 10.6096 13.2622C10.9802 13.019 11.4337 12.6122 11.9702 12.0417L8.61525 11.6527C8.07517 11.5913 7.66383 11.7096 7.38127 12.0076C7.0987 12.3055 7.02128 12.6741 7.14898 13.1133C7.27196 13.5362 7.5035 13.806 7.84361 13.9227C8.18371 14.0395 8.65377 14.0147 9.2538 13.8486ZM15.8433 17.9292C16.26 17.8138 16.5561 17.5779 16.7317 17.2218C16.9073 16.8656 16.8834 16.5514 16.6602 16.2793L14.3453 13.3349C14.18 13.9431 14.0855 14.5317 14.0618 15.1007C14.0381 15.6697 14.0878 16.1656 14.2108 16.5885C14.3669 17.1253 14.5821 17.5095 14.8566 17.7411C15.1311 17.9726 15.46 18.0353 15.8433 17.9292ZM15.9184 12.0556C16.0377 11.8468 16.1084 11.5943 16.1304 11.2983C16.1523 11.0022 16.1208 10.7077 16.0356 10.415C15.8843 9.89444 15.5815 9.50369 15.1275 9.24277C14.6734 8.98185 14.188 8.92296 13.6713 9.06603C13.3713 9.14912 13.1021 9.27644 12.8638 9.44786C12.6255 9.61935 12.4407 9.81989 12.3094 10.0496L14.5149 10.3879L15.9184 12.0556Z"
                  fill="#451D07"
                />
              </svg>
              <div className="text-black font-Montserrat text-[26px] font-semibold leading-[90%]">
                {formatValueDecimal(bgtData?.totalSupply ?? 0, "", 2, true)}
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>

        <div className="h-full flex flex-col items-start flex-[1.3] py-[34px] px-[15px] relative">
          <div className="w-[362px] flex items-center justify-between mb-[10px] ">
            <div className="text-[#3D405A]">Top 3 Validators</div>
          </div>
          <div className="flex flex-col gap-[12px]">
            {pageData?.top3EmittingValidators?.validators?.map(
              (validator: any) => (
                <TopValidator
                  key={validator?.id}
                  validator={validator}
                  handleValidator={handleValidator}
                />
              )
            )}
          </div>
          <div className="absolute right-0 top-[37px] bottom-[28px] w-[1px] bg-black/[0.15]" />
        </div>
        <div className="h-full flex flex-col flex-1 py-[24px] pl-[15px] justify-between">
          <div className="">
            <div className="text-black">Reward Weights</div>
            <div className="w-[180px] h-[180px] relative">
              <div className="absolute left-0 top-0 bottom-0 right-0 flex  flex-col items-center justify-center pointer-events-none">
                <div className="text-black text-[10px]">BGT DISTRIBUTED</div>
                <div className="text-black text-[10px]">
                  {numberFormatter(BgtDistributed, 2, true, { isShort: true })}
                </div>
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
                  >
                    {ChartsData.map((entry: any, index: number) => (
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
            { label: "All Vaults", value: "all" },
            { label: "Your Vaults", value: "your" }
          ]}
          onChange={(val) => {
            setTab(val);
          }}
          current={tab}
          className="w-[200px]"
          style={{ height: 40, borderRadius: 12 }}
          cursorStyle={{ borderRadius: 10 }}
        />
        {tab === "all" && (
          <div className="flex">
            <div className="w-auto flex items-center border bg-[#fff] rounded-[12px] overflow-hidden border-[#373A53] px-[15px] gap-[10px]">
              <svg
                width="21"
                height="15"
                viewBox="0 0 21 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="7.01829"
                  cy="7.01829"
                  r="6.01829"
                  stroke="#3D4159"
                  stroke-width="2"
                />
                <rect
                  x="14.9138"
                  y="9.64978"
                  width="6.141"
                  height="2.63186"
                  rx="1.31593"
                  transform="rotate(30 14.9138 9.64978)"
                  fill="#3D4159"
                />
              </svg>
              <input
                className=" w-[300px] h-[40px] bg-inherit outline-none"
                placeholder="Search..."
                // value={value || ""}
                onChange={_.debounce((ev: any) => {
                  console.log("======11111=====");
                  setValue(ev.target.value);
                }, 500)}
              />
            </div>
          </div>
        )}
      </div>
      {tab === "all" ? (
        <VaultsList value={value} />
      ) : (
        <FlexTable
          loading={loading}
          columns={Columns}
          list={filterList}
          sortDataIndex={sortDataIndex}
          renderEmpty={() => (
            <BgtEmpty
              handleExplore={() => {
                setTab("all");
                handleExplore();
              }}
            />
          )}
          onChangeSortDataIndex={(index) => {
            setSortDataIndex(sortDataIndex === index ? "" : index);
          }}
        />
      )}
      <Select
        visible={selectVisible}
        onClose={() => {
          setSelectVisible(false);
        }}
        onValidatorSelect={(id: string) => {
          router.push("/bgt/validator?id=" + id);
        }}
      />
    </div>
  );
});
