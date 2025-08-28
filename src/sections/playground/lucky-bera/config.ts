export enum SpinCategory {
  Coin = "coin",
  Gem = "gem",
  Bear = "bear",
  Bee = "bee",
  Honey = "honey",
}

export const SPIN_CATEGORIES: Record<SpinCategory, any> = {
  [SpinCategory.Coin]: {
    code: "1",
    icon: "/images/playground/lucky-bera/reward-coin.svg",
    value: SpinCategory.Coin,
    centerScale: 0.85,
    centerY: -4,
  },
  [SpinCategory.Gem]: {
    code: "2",
    icon: "/images/playground/lucky-bera/reward-gem.svg",
    value: SpinCategory.Gem,
    centerScale: 0.85,
    centerY: -2,
  },
  [SpinCategory.Bear]: {
    code: "3",
    icon: "/images/playground/lucky-bera/reward-bear.svg",
    value: SpinCategory.Bear,
    centerScale: 0.85,
    centerY: 0,
  },
  [SpinCategory.Bee]: {
    code: "4",
    icon: "/images/playground/lucky-bera/reward-bee.svg",
    value: SpinCategory.Bee,
    centerScale: 0.85,
    centerY: -2,
  },
  [SpinCategory.Honey]: {
    code: "5",
    icon: "/images/playground/lucky-bera/reward-honey.svg",
    value: SpinCategory.Honey,
    centerScale: 0.85,
    centerY: 2,
  },
};

export enum SpinMultiplier {
  X1 = 1,
  X2 = 2,
  X5 = 5,
  X10 = 10,
  X50 = 50,
  X100 = 100,
  X500 = 500,
  X1000 = 1000,
  X5000 = 5000,
}

export interface SpinUserData {
  id: number;
  tg_user_id: string;
  spin: number;
  bee: number;
  bee_level: number;
  refill_time: number;
  gem: number;
  bee_level_amount: number;
  bee_level_reward_coins: number;
}

export interface SpinResultData {
  amount: number;
  bee: number;
  bee_level_amount: number;
  bee_level_reward_coins: number;
  category: SpinCategory;
  code: string;
  gem: number;
  spin: number;
}
