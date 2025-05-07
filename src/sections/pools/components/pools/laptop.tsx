import { useMemo } from "react";
import List from "@/sections/marketplace/components/list";
import { bex, kodiak, burrbear } from "./columns";

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
        if (["bex", "burrbear"].includes(dex)) {
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

  const columns = useMemo(() => {
    if (dex === "bex") return bex({ page, PAGE_SIZE });
    if (dex === "kodiak") return kodiak({ page, PAGE_SIZE });
    if (dex === "burrbear") return burrbear({ page, PAGE_SIZE });
    return [];
  }, [dex]);

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
