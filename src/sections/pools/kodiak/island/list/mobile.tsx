import LazyImage from "@/components/layz-image";
import PoolTable from "../../../components/pool-table";
import { balanceShortFormated } from "@/utils/balance";
import Empty from "@/components/empty";
import CircleLoading from "@/components/circle-loading";
import Big from "big.js";

const Item = ({ record, setSelectedRecord }: any) => {
  return (
    <div className="rounded-[10px] bg-black/10 p-[14px]">
      <div className="flex justify-between">
        <PoolTable item={record} />
        <button
          onClick={() => {
            setSelectedRecord(record);
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
      <div className="flex justify-between items-center text-[14px] text-[#3D405A] font-medium mt-[16px]">
        <span>Min</span>
        <span>Max</span>
      </div>
      <div className="flex justify-between items-center mt-[6px]">
        <div className="flex items-center text-[14px] font-medium">
          <LazyImage
            src={record.token1.icon || "/assets/tokens/default_icon.png"}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="mx-[5px]">{record.upperPrice}</span>
          <span className="mx-[5px]">=</span>
          <LazyImage
            src={record.token0.icon || "/assets/tokens/default_icon.png"}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="ml-[5px]">1.0</span>
        </div>
        <div className="flex items-center text-[14px] font-medium">
          <LazyImage
            src={record.token1.icon || "/assets/tokens/default_icon.png"}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="mx-[5px]">{record.upperPrice}</span>
          <span className="mx-[5px]">=</span>
          <LazyImage
            src={record.token0.icon || "/assets/tokens/default_icon.png"}
            width={20}
            height={20}
            className="rounded-full"
          />
          <span className="ml-[5px]">1.0</span>
        </div>
      </div>
      <div className="flex mt-[16px]">
        <div className="w-1/3 flex flex-col items-start">
          <div className="text-[14px] text-[#3D405A] font-medium">TVL</div>
          <div className="text-[15px] font-semibold">
            ${balanceShortFormated(record["tvl"], 2)}
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-center">
          <div className="text-[14px] text-[#3D405A] font-medium">Volume</div>
          <div className="text-[15px] font-semibold">
            ${balanceShortFormated(record["volume"], 2)}
          </div>
        </div>
        <div className="w-1/3 flex flex-col items-end">
          <div className="text-[14px] text-[#3D405A] font-medium">APR</div>
          <div className="text-[15px] font-semibold">
            {record.apr ? Big(record.apr).toFixed(2) : "-"}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default function IslandMobile({ pools, loading, onSelect }: any) {
  return (
    <div className="px-[12px] pb-[20px] pt-[16px] flex flex-col gap-[12px] h-[calc(100%-120px)] overflow-y-auto">
      {pools.length === 0 && !loading && (
        <div className="mt-[50px] w-full flex justify-center items-center">
          <Empty desc="No Pools." />
        </div>
      )}
      {loading && (
        <div className="flex items-center h-[200px] justify-center">
          <CircleLoading />
        </div>
      )}
      {pools.map((item: any, idx: number) => (
        <Item key={idx} record={item} setSelectedRecord={onSelect} />
      ))}
    </div>
  );
}
