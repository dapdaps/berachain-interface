import PoolsCom from "../components/pools";
import usePools from "./use-pools";

export default function Pools() {
  const { pools, loading } = usePools();

  return <PoolsCom pools={pools} loading={loading} dex="bex" />;
}
