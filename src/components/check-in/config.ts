export enum RewardType {
  Spin = "spin",
  Gem = "points",
  Box = "box",
  Cosmetic = "cosmetic",
  NFT = "nft",
}

export interface Reward {
  type: RewardType;
  amount: number | string;
  label: any;
  img?: any;
}
