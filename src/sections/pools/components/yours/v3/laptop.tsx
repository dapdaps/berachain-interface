import { useState, useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import Dropdown from "@/sections/marketplace/components/dropdown";
import Big from "big.js";
import Status from "./status";
import PoolTable from "../../pool-table";
import { balanceFormated } from "@/utils/balance";

const PAGE_SIZE = 9;

export default function V3List({
  pools,
  loading,
  ticksInfo,
  onAction,
  withoutHeader
}: any) {
  const [page, setPage] = useState(1);

  const maxPage = useMemo(() => {
    return Math.ceil(pools.length / PAGE_SIZE) || 1;
  }, [pools]);

  const data = useMemo(
    () => pools.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [pools, page]
  );

  return (
    <List
      meta={[
        {
          title: "Position",
          key: "position",
          sort: false,
          width: "28%",
          render: (item: any, index: number) => {
            return <PoolTable item={item} />;
          }
        },
        {
          title: "Range",
          key: "range",
          sort: true,
          width: "30%",
          render: (item: any, index: number) => {
            return (
              <div className="flex items-center gap-[10px]">
                <Status ticksInfo={ticksInfo} item={item} />
                <div className="text-[14px]">
                  <div className="flex gap-[3px]">
                    <div className="text-[#979ABE]">Min:</div>
                    <div>
                      {item.lowerPrice} {item.token1.symbol} per{" "}
                      {item.token0.symbol}
                    </div>
                  </div>
                  <div className="flex gap-[3px]">
                    <div className="text-[#979ABE]">Max:</div>
                    <div>
                      {item.upperPrice} {item.token1.symbol} per{" "}
                      {item.token0.symbol}
                    </div>
                  </div>
                </div>
              </div>
            );
          }
        },
        {
          title: "Unclaimed Fees",
          key: "fees",
          sort: false,
          width: "15%",
          render: (item: any, index: number) => {
            return item["fees"] || "-";
          }
        },
        {
          title: "My Position",
          key: "position",
          sort: false,
          width: "15%",
          render: (item: any, index: number) => {
            return item["position"]
              ? `$${balanceFormated(item["position"], 2)}`
              : "-";
          }
        },
        {
          title: "Action",
          key: "position",
          sort: false,
          width: "12%",
          render: (item: any, index: number) => {
            const actions = Big(item.liquidity || 0).eq(0)
              ? [
                  { key: "increase", name: "Increase" },
                  { key: "claim", name: "Claim Rewards" }
                ]
              : [
                  { key: "increase", name: "Increase" },
                  { key: "remove", name: "Remove" },
                  { key: "claim", name: "Claim Rewards" }
                ];
            return (
              <div>
                <Dropdown
                  list={actions}
                  value=""
                  placeholder="Manage"
                  onChange={(val) => {
                    onAction(val, item);
                  }}
                  style={{
                    height: 32,
                    width: 96,
                    padding: "0px 10px",
                    gap: 4,
                    background: "#FFDC50"
                  }}
                  dropdownStyle={{
                    top: 36,
                    width: 130
                  }}
                />
              </div>
            );
          }
        }
      ]}
      list={data}
      maxPage={maxPage}
      onPageChange={setPage}
      bodyClassName="h-[480px] overflow-y-auto"
      loading={loading}
      withoutHeader={withoutHeader}
    />
  );
}
