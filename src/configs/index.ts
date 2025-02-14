import { bera } from "./tokens/bera";

export const DEFAULT_CHAIN_ID =
  Number(process.env.NEXT_PUBLIC_CHAIN_ID) || 80094;

export const IS_MAINNET = DEFAULT_CHAIN_ID === 80094;

export const DEFAULT_SWAP_DAPP = "beraswap";

export const DEFAULT_LIQUIDITY_DAPP = "infrared";

export const TOKENS: Record<string, any> = Object.values(bera).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);
