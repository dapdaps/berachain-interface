import { useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import PoolTable from "../pool-table";
import { numberFormatter } from "@/utils/number-formatter";

const PAGE_SIZE = 10;

export default function Laptop({
  pools,
  page,
  setPage,
  searchVal,
  setSelectedRecord,
  loading
}: any) {
  const list = useMemo(
    () =>
      pools.filter((pool: any) => {
        let flag = true;
        if (
          searchVal &&
          !(
            pool.token0.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            pool.token0.symbol
              .toLowerCase()
              .includes(searchVal.toLowerCase()) ||
            pool.token1.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            pool.token1.symbol.toLowerCase().includes(searchVal.toLowerCase())
          )
        )
          flag = false;
        return flag;
      }),
    [pools, searchVal]
  );

  const maxPage = useMemo(() => {
    return Math.ceil(list.length / PAGE_SIZE) || 1;
  }, [list]);

  const data = useMemo(
    () => list.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [list, page]
  );

  const columns = [
    {
      title: "#",
      key: "#",
      sort: false,
      width: "5%",
      render: (item: any, index: number) => {
        return PAGE_SIZE * (page - 1) + index + 1;
      }
    },
    {
      title: "Pool",
      key: "pool",
      sort: false,
      width: "50%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "TVL",
      key: "tvl",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["tvl"]
          ? numberFormatter(item["tvl"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    },
    {
      title: " 24h Volume",
      key: " 24h Volume",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["volume24h"]
          ? numberFormatter(item["volume24h"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    },
    {
      title: " 24h Fees",
      key: " 24h Fees",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["fees24h"]
          ? numberFormatter(item["fees24h"], 2, true, {
              prefix: "$",
              isShort: true
            })
          : "-";
      }
    }
  ];

  return (
    <div className="mt-[20px]">
      <List
        meta={columns}
        list={data}
        maxPage={maxPage}
        onPageChange={setPage}
        bodyClassName="h-[480px] overflow-y-auto"
        onItemClick={(item: any) => {
          setSelectedRecord(item);
        }}
        loading={loading}
      />
    </div>
  );
}
