import PoolsCom from "../components/pools";
import usePools from "./use-pools";

export default function Pools() {
  const { pools, loading } = usePools();
  console.log("pools", pools);
  return <PoolsCom pools={pools} loading={loading} dex="burrear" />;
}
