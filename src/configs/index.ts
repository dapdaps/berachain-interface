import { beraB } from "./tokens/bera-bArtio";

export const DEFAULT_CHAIN_ID = 80084;

export const DEFAULT_SWAP_DAPP = "bex";

export const DEFAULT_LIQUIDITY_DAPP = "infrared";

export const BGT_ADDRESS = "0xbDa130737BDd9618301681329bF2e46A016ff9Ad";

export const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);
