import { beraB } from './tokens/bera-bArtio';
import { berachainTestnetbArtio } from '@reown/appkit/networks';

export const IS_TESTNET_BARTIO = true;

export const BERACHAIN_ID = IS_TESTNET_BARTIO ? berachainTestnetbArtio.id : 0;
export const BERACHAIN = berachainTestnetbArtio;

export const DEFAULT_CHAIN_ID = BERACHAIN_ID;

export const DEFAULT_SWAP_DAPP = 'bex';

export const DEFAULT_LIQUIDITY_DAPP = 'infrared';

export const TOKENS: Record<string, any> = Object.values(beraB).reduce(
  (acc, curr) => ({ ...acc, [curr.address.toLowerCase()]: curr }),
  {}
);
