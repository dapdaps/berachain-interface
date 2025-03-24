interface BasicCurrency {
  name: string;
  symbol: string;
  decimals: number;
}

export interface Token {
  chainId: number;
  address: string;
  name?: string;
  symbol: string;
  icon: string;
  logoURI?: string;
  decimals: number;
  isNative?: boolean;
  priceKey?: string;
  usd?: string;
  color?: string;
  isMeme?: boolean;
}

export interface Chain {
  chainId: number;
  chainName: string;
  icon: string;
  nativeCurrency: BasicCurrency;
  rpcUrls: string[];
  blockExplorers: string;
}


export type TCategory = "volume" | "transactions"
export interface IRank {
  id: number
  address: string
  actual_volume: number
  volume: number
  transactions: number
  rank_transactions: number
  rank_volume: number
}
export interface IYourRank {
  id: number
  address: string
  actual_volume: number
  volume: number
  transactions: number
  rank_transactions: number
  rank_volume: number
  away_top_volume: any
}