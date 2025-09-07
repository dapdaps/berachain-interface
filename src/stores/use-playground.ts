import { WheelUserData } from "@/sections/playground/big-wheel/config";
import { SpinUserData } from "@/sections/playground/lucky-bera/config";
import { create } from "zustand";

interface PlaygroundState {
  spinUserData?: Partial<SpinUserData>;
  setSpinUserData: (spinUserData?: Partial<SpinUserData>) => void;
  wheelUserData?: Partial<WheelUserData>;
  setWheelUserData: (wheelUserData?: Partial<WheelUserData>) => void;
}

export const usePlaygroundStore = create<PlaygroundState>((set, get: any) => ({
  spinUserData: void 0,
  setSpinUserData: (_spinUserData) => set((state) => {
    if (!_spinUserData) {
      return {
        spinUserData: void 0,
      };
    }
    return {
      spinUserData: {
        ...state.spinUserData,
        ..._spinUserData,
      },
    };
  }),
  wheelUserData: void 0,
  setWheelUserData: (_wheelUserData) => set((state) => {
    if (!_wheelUserData) {
      return {
        wheelUserData: void 0,
      };
    }
    return {
      wheelUserData: {
        ...state.wheelUserData,
        ..._wheelUserData,
      },
    };
  }),
}));
