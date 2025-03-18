import List from "@/sections/marketplace/components/list";
import { balanceShortFormated } from "@/utils/balance";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo } from "react";
import PoolTable from "../../../components/pool-table";
import Big from "big.js";

const PAGE_SIZE = 9;

export default function Laptop({
  pools,
  page,
  setPage,
  searchVal,
  onSelect,
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
      width: "45%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "Apr",
      key: "apr",
      sort: true,
      width: "20%",
      render: (item: any, index: number) => {
        return Big(item?.["apr"] ?? 0).gt(0)
          ? `${numberFormatter(item["apr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "TVL",
      key: "tvl",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["tvl"] ? balanceShortFormated(item["tvl"], 2) : "-";
      }
    },
    {
      title: "Volume",
      key: "volume",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["volume"] ? balanceShortFormated(item["volume"], 2) : "-";
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
          onSelect(item);
        }}
        loading={loading}
      />
    </div>
  );
}
