import { useMemo, useState } from 'react';
import PoolsCom from '../components/pools';
import { beraB } from '@/configs/tokens/bera-bArtio';

export default function Pools() {
  const [version, setVersion] = useState('v3');
  const pools = useMemo(
    () =>
      version === 'v3'
        ? [
            {
              token0: beraB['bera'],
              token1: beraB['honey'],
              fee: 3000
            }
          ]
        : [
            {
              token0: beraB['bera'],
              token1: beraB['honey']
            }
          ],
    [version]
  );
  return (
    <PoolsCom
      pools={pools}
      dex='kodiak'
      currentTab={version}
      onChangeTab={setVersion}
    />
  );
}
