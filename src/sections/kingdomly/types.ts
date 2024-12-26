export enum Status {
  LIVE = 'live',
  SOLD_OUT = 'sold_out',
  PAUSED = 'paused',
  UPCOMING = 'upcoming'
}

interface Chain {
  chain_id: number;
  chain_name: string;
  native_currency: string;
}

interface MintGroupData {
  name: string;
  price: number;
  allocation: number;
  max_mint_per_wallet: number;
  mint_group_description: string;
  mint_group_description_RTE: string;
}

export interface NFTCollection {
  collection_name: string;
  header_image: string;
  profile_image: string;
  description: string;
  description_RTE: string;
  total_supply: number;
  mint_live_timestamp: number;
  mint_group_data: MintGroupData[];
  slug: string;
  chain: Chain;
  contract_address: string;
}

export interface NFTCollectionWithStatus extends NFTCollection {
  status: Status;
  totalSupplyByContract?: string;
  maxSupplyByContract?: string;
  displayPrice: number;
}