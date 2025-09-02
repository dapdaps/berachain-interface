export const REDDEM_SPINS_EXCHANGE_RATE_GEM_TO_SPINS = 100;

export interface WheelUserData {
  address: string;
  wheel_balance: number;
}

export interface WheelResultData {
  reward_spin_amount: number;
  wheel_balance: number;
}
