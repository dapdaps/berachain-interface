import PoolsCom from "../components/pools";
import usePools from "./use-pools";

export default function Pools() {
  const { page, pools, loading, hasMore, onNextPage } = usePools();

  return (
    <PoolsCom
      pools={pools}
      loading={loading}
      dex="burrbear"
      hasMore={hasMore}
      page={page}
      setPage={onNextPage}
    />
  );
}
