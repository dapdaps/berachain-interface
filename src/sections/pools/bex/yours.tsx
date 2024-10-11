import Com from '../components/yours';
import usePools from './use-pools';

export default function Yours() {
  const { pools, loading, queryPools } = usePools();

  return (
    <Com
      pools={pools}
      dex='bex'
      loading={loading}
      onSuccess={() => {
        queryPools();
      }}
    />
  );
}
