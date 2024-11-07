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
        },
        {
          token0: beraB['usdc'],
          token1: beraB['honey'],
          id: 3
        },
        {
          token0: beraB['honey'],
          token1: beraB['weth'],
          id: 4
        },
        {
          token0: beraB['honey'],
          token1: beraB['wbtc'],
          id: 5
        }
      ]}
      dex='bex'
    />
  );
}
