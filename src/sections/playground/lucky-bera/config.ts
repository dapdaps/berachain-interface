// https://api.beratown.app is production api
export const BUY_SPINS_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_API === "https://api.beratown.app" ? "0x07D5f8f2024E24A2183c6722f3aA0d8349d19d9c" : "0x75F89c147E9Aa9C2C878E9D3065A5D4245672201";
export const BUY_SPINS_EXCHANGE_RATE_BERA_TO_SPINS = 0.1;

export enum SpinCategory {
  Spin = "Spin",
  Gem = "Gem",
  Box = "Box",
  Rocket = "Xp",
  Apple = "Apple",
}

export const SPIN_CATEGORIES: Record<SpinCategory, any> = {
  [SpinCategory.Spin]: {
    code: 2,
    icon: "/images/playground/lucky-bera/icon-reward/spin.svg",
    value: SpinCategory.Spin,
    centerScale: 0.85,
    centerY: -4,
  },
  [SpinCategory.Gem]: {
    code: 1,
    icon: "/images/playground/lucky-bera/icon-reward/gem.svg",
    value: SpinCategory.Gem,
    centerScale: 0.85,
    centerY: -2,
  },
  [SpinCategory.Box]: {
    code: 3,
    icon: "/images/playground/lucky-bera/icon-reward/box.svg",
    value: SpinCategory.Box,
    centerScale: 0.85,
    centerY: 0,
  },
  [SpinCategory.Rocket]: {
    code: 4,
    icon: "/images/playground/lucky-bera/icon-reward/rocket.svg",
    value: SpinCategory.Rocket,
    centerScale: 0.85,
    centerY: 0,
  },
  [SpinCategory.Apple]: {
    code: 5,
    icon: "/images/playground/lucky-bera/icon-reward/apple.svg",
    value: SpinCategory.Apple,
    centerScale: 0.85,
    centerY: -2,
  },
};

export enum SpinXpRewardCategory {
  Spin = "Spin",
  Wheel = "Wheel",
}

export const SPIN_XP_REWARD_CATEGORIES: Record<SpinXpRewardCategory, any> = {
  [SpinXpRewardCategory.Spin]: {
    icon: "/images/playground/lucky-bera/icon-reward/spin.svg",
    value: SpinXpRewardCategory.Spin,
  },
  [SpinXpRewardCategory.Wheel]: {
    icon: "/images/check-in/spin.png",
    value: SpinXpRewardCategory.Wheel,
  },
}

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
  address: string;
  game_xp: {
    level: number;
    reward: string;
    rewardAmount: number;
    xp: number;
  };
  spin_balance: number;
  xp_balance: number;
  xp_level: number;
}

export interface SpinResultData {
  codes: number[];
  draw_codes: number[];
  draw_reward: string;
  draw_reward_amount: string;
  game_xp: {
    level: number;
    reward: string;
    rewardAmount: number;
    xp: number;
  };
  spin_balance: number;
  xp_balance: number;
  xp_changed: boolean;
  xp_level: number;
  // front-end only
  currentSpinUserData?: SpinUserData;
}

export const GoodsList = [
  {
    id: 1,
    price: 10,
    delPrice: 10.5,
    amount: 105,
    isHot: true,
    add: 0.05,
  },
  {
    id: 2,
    price: 20,
    delPrice: 22,
    amount: 220,
    isHot: false,
    add: 0.1,
  },
  {
    id: 3,
    price: 50,
    delPrice: 60,
    amount: 600,
    isHot: false,
    add: 0.2,
  },
];
