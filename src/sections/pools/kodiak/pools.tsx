import { useMemo, useState } from 'react';
import PoolsCom from '../components/pools';
import { beraB } from '@/configs/tokens/bera-bArtio';
import usePoolsIslands from './use-pools-islands';

export default function Pools() {
  const [version, setVersion] = useState('v3');
  const { loading, pools: islands } = usePoolsIslands();
  const pools = useMemo(
    () =>
      version === 'v3'
        ? [
            {
              token0: beraB['bera'],
              token1: beraB['honey'],
              fee: 3000,
              version: 'v3'
            }
          ]
        : version === 'v2'
        ? [
            {
              token0: beraB['bera'],
              token1: beraB['honey'],
              version: 'v2'
            }
          ]
        : islands,
    [version, islands]
  );
  return (
    <PoolsCom
      pools={pools}
      dex='kodiak'
      currentTab={version}
      onChangeTab={setVersion}
      loading={loading}
      tabs={[
        // { label: 'Islands', value: 'islands' },
        { label: 'V3 Pools', value: 'v3' },
        { label: 'V2 Pools', value: 'v2' }
      ]}
    />
  );
}
