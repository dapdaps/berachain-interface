import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SpinResultData } from "./config";

type UserState = {
  lastSpinResult?: Partial<SpinResultData>;
  setLastSpinResult: (data: Partial<SpinResultData>) => void;
};

export const useLuckyBeraStore = create(
  persist<UserState>((set) => ({
    setLastSpinResult: (data) => set({
      lastSpinResult: data,
    }),
  }), {
    name: "_BERATOWN_LUCKY_BERA",
    version: 0.1,
    storage: createJSONStorage(() => localStorage),
    partialize: (state) => {
      return ({ lastSpinResult: state.lastSpinResult } as any);
    }
  })
);
