export enum RewardType {
  Spin = "spin",
  Gem = "points",
  Box = "box",
  Cosmetic = "cosmetic",
}

export interface Reward {
  type: RewardType;
  amount: number | string;
  label: any;
}
