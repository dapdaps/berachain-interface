import lending from './lending';
import liquidity from './liquidity';
// import pool from './pool';
// import staking from './staking';
import swap from './swap';

export default {
  ...swap,
  ...lending,
  ...liquidity
} as { [key: string]: any };
