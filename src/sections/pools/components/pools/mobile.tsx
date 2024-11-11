import { useEffect, useState } from "react";
import Big from "big.js";
import List from "@/components/flex-table";
import PoolTable from "../pool-table";
import Empty from "@/components/empty";
import Dropdown from "@/components/dropdown";
import { balanceShortFormated } from "@/utils/balance";
import { upperFirst, cloneDeep } from "lodash";
import clsx from "clsx";

export default function Mobile({
  pools,
  setSelectedRecord,
  type,
  loading
}: any) {
  const [sortType, setSortType] = useState(-1);
  const [data, setData] = useState([]);
  const [sortItem, setSortItem] = useState<any>();

  useEffect(() => {
    if (!pools.length) return;
    if (!sortItem) {
      setData(pools);
      return;
    }

    setData(
      cloneDeep(pools).sort((a: any, b: any) =>
        Big(b[sortItem.key] || 0).gt(a[sortItem.key] || 0)
          ? sortType
          : -sortType
      )
    );
  }, [sortItem, sortType, pools]);

  return (
    <div className={clsx("h-full", type === "kodiak" && "mt-[20px]")}>
      <div className="flex items-center p-[0px_15px_8px] border-b border-b-black/20 justify-between text-[14px] text-[#3D405A] md:hidden">
        <div>{upperFirst(type)}</div>
        <div className="flex items-center gap-[8px]">
          <Dropdown
            list={[
              { key: "tvl", name: "TVL" },
              { key: "volume", name: "Volume" }
            ]}
            title={`Sort by ${sortItem?.name || "TVL"}`}
            value="tvl"
            onChange={(val: any) => {
              setSortType(-sortType);
              setSortItem(val);
            }}
            className="border-none bg-transparent gap-[3px] px-0"
            titleClassName="text-[14px] font-normal"
            dropPanelClassName="top-[30px]"
          />
        </div>
      </div>
      <div className="mt-[10px]">
        <List
          columns={[
            {
              title: "Pool",
              dataIndex: "pool",
              width: "70%",
              render: (_: any, record) => {
                return (
                  <PoolTable
                    item={record}
                    onClick={() => {
                      setSelectedRecord(record);
                    }}
                  />
                );
              }
            },
            {
              title: "TVL",
              dataIndex: "tvl",
              width: "30%",
              align: "right",
              render: (_, record) => {
                return record["tvl"]
                  ? balanceShortFormated(record["tvl"], 2)
                  : "-";
              }
            }
          ]}
          list={data}
          wrapperClass="h-[calc(100%-144px)] overflow-y-auto"
          bodyClass="py-[14px] h-[58px]"
          showHeader={false}
          renderEmpty={() => (
            <div className="mt-[50px] w-full flex justify-center items-center">
              <Empty desc="No Pools." />
            </div>
          )}
          loading={loading}
        />
      </div>
    </div>
  );
}
