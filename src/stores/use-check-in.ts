import { create } from "zustand";

export enum CheckInReward {
  Lootbox = "lootbox",
  Points = "points",
}

export interface CheckInDay {
  day: number;
  checked: boolean;
  reward: CheckInReward;
}

export interface CheckInData {
  total_check_in: number;
  today_check_in: boolean;
  consecutive_check_in: number;
  reward_box_amount: number;
  days: CheckInDay[];
}

interface CheckInState {
  checkInData?: Partial<CheckInData>;
  setCheckInData: (checkInData?: Partial<CheckInData>) => void;
}

export const useCheckInStore = create<CheckInState>((set, get: any) => ({
  checkInData: void 0,
  setCheckInData: (_checkInData) => set((state) => {
    if (!_checkInData) {
      return {
        checkInData: void 0,
      };
    }
    return {
      checkInData: {
        ...state.checkInData,
        ..._checkInData,
      },
    };
  }),
}));
