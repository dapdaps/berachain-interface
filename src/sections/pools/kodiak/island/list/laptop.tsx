import List from "@/sections/marketplace/components/list";
import { balanceShortFormated } from "@/utils/balance";
import { numberFormatter } from "@/utils/number-formatter";
import { useMemo, useState } from "react";
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
  const [sort, setSort] = useState<any>({});

  const list = useMemo(() => {
    const _pools = pools.filter((pool: any) => {
      let flag = true;
      if (
        searchVal &&
        !(
          pool.token0.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          pool.token0.symbol.toLowerCase().includes(searchVal.toLowerCase()) ||
          pool.token1.name.toLowerCase().includes(searchVal.toLowerCase()) ||
          pool.token1.symbol.toLowerCase().includes(searchVal.toLowerCase())
        )
      )
        flag = false;
      return flag;
    });

    if (sort.key) {
      _pools.sort((a: any, b: any) => {
        if (sort.type === 1) {
          return a[sort.key] - b[sort.key];
        } else {
          return b[sort.key] - a[sort.key];
        }
      });
    }

    return _pools;
  }, [pools, searchVal, sort]);

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
      width: "35%",
      render: (item: any, index: number) => {
        return <PoolTable item={item} />;
      }
    },
    {
      title: "Apr",
      key: "apr",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return (
          <div className="flex items-center gap-[4px]">
            <span>
              {Big(item?.["apr"] ?? 0).gt(0)
                ? `${numberFormatter(item["apr"], 2, true)}%`
                : "-"}
            </span>
            {item.farm?.provider === "bgt" && (
              <img
                src="/images/icon-bgt.svg"
                className="w-[20px] h-[20px] rounded-full"
              />
            )}
          </div>
        );
      }
    },
    {
      title: "Pool TVL",
      key: "poolTvl",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item["poolTvl"] ? balanceShortFormated(item["poolTvl"], 2) : "-";
      }
    },
    {
      title: "Farm TVL",
      key: "farmTvl",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item.farm?.tvl ? balanceShortFormated(item.farm.tvl, 2) : "-";
      }
    },
    {
      title: "Holdings",
      key: "balanceUSD",
      sort: true,
      width: "15%",
      render: (item: any, index: number) => {
        return item.balanceUSD
          ? "$" + balanceShortFormated(item.balanceUSD, 2)
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
          onSelect(item);
        }}
        loading={loading}
        onChangeSort={(sort: string, type: number) => {
          setSort({
            key: sort,
            type
          });
        }}
      />
    </div>
  );
}
