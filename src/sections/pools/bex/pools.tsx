import PoolsCom from '../components/pools';
import { beraB } from '@/configs/tokens/bera-bArtio';

export default function Pools() {
  return (
    <PoolsCom
      pools={[
        {
          token0: beraB['bera'],
          token1: beraB['honey'],
          id: 1
        },
        {
          token0: beraB['usdt'],
          token1: beraB['honey'],
          id: 2
        }
      ]}
      dex='bex'
    />
  );
}
