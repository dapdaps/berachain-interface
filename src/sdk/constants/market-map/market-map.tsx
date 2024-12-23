import { MarketMap11155111 } from "./11155111";

import type { SupportedMarket } from "./utils";

export {
  MarketMap11155111,
};

export const SupportedMarketMap = {
  ...MarketMap11155111,
} as Record<string, SupportedMarket>;

export const MarketList = Object.values(SupportedMarketMap);

export const isVerifiedMarket = (
  marketId: string | undefined | null,
): boolean => {
  if (!marketId) return false;

  return !!SupportedMarketMap[marketId];
};

export const getVerifiedMarket = (
  marketId: string | undefined | null,
): SupportedMarket | undefined => {
  if (!marketId) return undefined;

  return SupportedMarketMap[marketId];
};

export const getSupportedMarket = (
  key: string | null | undefined,
): SupportedMarket | undefined => {
  if (!key) return undefined;

  const market = SupportedMarketMap[key];

  if (!market) return undefined;

  return market;
};
