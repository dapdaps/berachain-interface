import { beraB } from './tokens/bera-bArtio';

export const DEFAULT_CHAIN_ID = 80084;

export const DEFAULT_SWAP_DAPP = 'bex';

export const DEFAULT_LIQUIDITY_DAPP = 'infrared';

export const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);
