import { useState, useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import Dropdown from "@/sections/marketplace/components/dropdown";
import PoolTable from "../../pool-table";
import { numberFormatter } from "@/utils/number-formatter";

const PAGE_SIZE = 9;

export default function V2List({ pools, loading, onAction }: any) {
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
          title: "Pair",
          key: "pair",
          sort: false,
          width: "45%",
          render: (item: any, index: number) => {
            return <PoolTable item={item} />;
          }
        },
        {
          title: "You Deposit",
          key: "deposit",
          sort: false,
          width: "20%",
          render: (item: any, index: number) => {
            return item["deposit"]
              ? numberFormatter(item["deposit"], 2, true, {
                  prefix: "$",
                  isShort: true
                })
              : "-";
          }
        },
        {
          title: "Your Shares",
          key: "shares",
          sort: false,
          width: "20%",
          render: (item: any, index: number) => {
            return item["shares"]
              ? numberFormatter(item["shares"], 2, true, {
                  isShort: true
                }) + "%"
              : "-";
          }
        },
        {
          title: "Action",
          key: "position",
          sort: false,
          width: "15%",
          render: (item: any, index: number) => {
            return (
              <div>
                <Dropdown
                  list={[
                    { key: "increase", name: "Increase" },
                    { key: "remove", name: "Remove" }
                  ]}
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
                    top: 36
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
    />
  );
}
