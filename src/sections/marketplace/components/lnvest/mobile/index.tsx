import { useMemo, useState } from "react";
import MenuButton from "@/components/mobile/menuButton";
import Dropdown from "@/components/dropdown";
import CheckBox from "@/components/check-box";
import Empty from "@/components/empty";
import CircleLoading from "@/components/circle-loading";
import Big from "big.js";
import { cloneDeep } from "lodash";
import { formatValueDecimal } from "@/utils/balance";
import HandleModal from "@/sections/vaults/mobile/handle-modal";
import UserInfo from "@/sections/vaults/mobile/user-info";
import useInfraredList from "@/sections/staking/hooks/use-infrared-list";

export default function Mobile({ filterList, loading, onClick }: any) {
  return (
    <div className="min-h-screen relative">
      <div className="relative z-[2] flex flex-col gap-[12px] pb-[12px] mt-[12px] h-[calc(100%-244px)] overflow-y-auto">
        {filterList.map((item: any, idx: number) => (
          <Item
            key={item.id}
            data={item}
            onClick={(type: 0 | 1) => {
              onClick(item, type);
            }}
          />
        ))}
        {filterList.length === 0 && !loading && (
          <div className="mt-[50px] w-full flex justify-center items-center">
            <Empty desc="No Pools." />
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center h-[200px]">
            <CircleLoading />
          </div>
        )}
      </div>
    </div>
  );
}

const Item = ({ data, onClick }: any) => {
  const pool = data?.pool;
  console.log("===pool", pool);
  return (
    <div>
      <div className="bg-black/[0.06] rounded-[10px] backdrop-blur-sm p-[14px]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center relative">
              {data?.images[0] && (
                <img
                  className="mr-[-8px] rounded-full"
                  src={data?.images[0]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              {data?.images[1] && (
                <img
                  className="rounded-full"
                  src={data?.images[1]}
                  width={40}
                  height={40}
                  alt="Token"
                />
              )}
              <img
                className="absolute right-[-2px] bottom-[0px]"
                src={
                  pool?.protocol === "BEX"
                    ? "/images/dapps/bex.svg"
                    : pool?.protocol === "aquabera"
                    ? "/images/dapps/infrared/aquabera.png"
                    : pool?.protocol === "Kodiak Finance"
                    ? "/images/dapps/kodiak.svg"
                    : "/images/dapps/infrared/berps.svg"
                }
                width={20}
                height={20}
                alt="Protocol"
              />
            </div>
            <div>
              <div className="text-[16px] font-semibold">
                {pool?.name || "iBGT"}
              </div>
              <div className="text-[14px] mt-[4px] capitalize">
                {pool?.protocol}
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              onClick(0);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <rect
                x="1"
                y="1"
                width="32"
                height="32"
                rx="10"
                fill="#FFDC50"
                stroke="black"
              />
              <path
                d="M18.0211 18.0921L22.7387 18.0922C23.0934 18.0921 23.381 17.8651 23.3809 17.5852L23.3809 16.5566C23.3809 16.2767 23.0932 16.0504 22.7383 16.05L18.021 16.0502L18.0209 11.3328C18.0211 10.9779 17.7943 10.6901 17.5142 10.6902L16.4855 10.6903C16.2059 10.6901 15.9789 10.9777 15.9791 11.3327L15.9792 16.0502L11.2615 16.0503C10.9069 16.0503 10.6191 16.2767 10.6191 16.5567L10.6191 17.5853C10.6191 17.8652 10.9068 18.0922 11.2614 18.0923L15.9792 18.0922L15.9792 22.8093C15.9791 23.1647 16.2058 23.4519 16.4857 23.452L17.5144 23.4519C17.7942 23.4518 18.0211 23.1644 18.0213 22.8097L18.0211 18.0921Z"
                fill="black"
              />
            </svg>
          </button>
        </div>
        <div className="mt-[16px] flex justify-between">
          <div>
            <div className="font-medium	text-[14px]">TVL</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {formatValueDecimal(data?.tvl, "$", 2, true)}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium	text-[14px]">APY</div>
            <div className="font-semibold	text-[16px] mt-[8px]">
              {Big(data?.apy ?? 0).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      {Big(data?.usdDepositAmount || 0).gt(0) && (
        <div className="text-white bg-black/50 rounded-[10px] p-[14px] flex items-center justify-between gap-[20px]">
          <UserInfo data={data} />
          <button
            onClick={() => {
              onClick(1);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="34"
              height="34"
              viewBox="0 0 34 34"
              fill="none"
            >
              <rect
                opacity="0.5"
                x="1"
                y="1"
                width="32"
                height="32"
                rx="10"
                stroke="white"
              />
              <rect x="11" y="16" width="13" height="2" rx="1" fill="white" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};
