import { useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import PoolTable from "../pool-table";
import { numberFormatter } from "@/utils/number-formatter";
import Big from "big.js";

const PAGE_SIZE = 10;

export default function Laptop({
  pools,
  page,
  setPage,
  searchVal,
  setSelectedRecord,
  loading,
  dex
}: any) {
  const list = useMemo(
    () =>
      pools.filter((pool: any) => {
        if (!searchVal) return true;

        let tokens: any = [];
        if (dex === "bex") {
          tokens = pool.tokens;
        } else {
          tokens = [pool.token0, pool.token1];
        }

        return tokens.some(
          (token: any) =>
            token.name.toLowerCase().includes(searchVal.toLowerCase()) ||
            token.symbol.toLowerCase().includes(searchVal.toLowerCase())
        );
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
      width: "30%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "Pool APR",
      key: "apr",
      sort: true,
      width: "13%",
      render: (item: any, index: number) => {
        return Big(item?.["apr"] ?? 0).gt(0)
          ? `${numberFormatter(item["apr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "BGT APR",
      key: "bgtApr",
      sort: true,
      width: "13%",
      render: (item: any, index: number) => {
        return Big(item?.["bgtApr"] ?? 0).gt(0)
          ? `${numberFormatter(item["bgtApr"], 2, true)}%`
          : "-";
      }
    },
    {
      title: "TVL",
      key: "tvl",
      sort: true,
      width: "10%",
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
      width: "14%",
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
