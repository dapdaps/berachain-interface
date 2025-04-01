import Com from "../components/yours";
import useUserPools from "./use-user-pools";

export default function Yours() {
  const { pools, loading, queryPools } = useUserPools();

  return (
    <Com
      pools={pools}
      dex="burrbear"
      loading={loading}
      onSuccess={() => {
        queryPools();
      }}
    />
  );
}
