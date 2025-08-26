export enum RewardType {
  Spin = "spin",
  Gem = "points",
}

export interface Reward {
  type: RewardType;
  amount: number | string;
  label: any;
}
