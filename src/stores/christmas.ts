import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export enum ChristmasRingStatus {
  Playing = 'playing',
  Paused = 'paused',
}

type ChristmasState = {
  ringStatus: ChristmasRingStatus;
};

type ChristmasStore = ChristmasState & {
  setRingStatus: (status: ChristmasRingStatus) => void;
  set: (state: Partial<ChristmasState>) => void;
};

export const useChristmasStore = create(
  persist<ChristmasStore>(
    (set) => ({
      ringStatus: ChristmasRingStatus.Paused,
      setRingStatus: (status: ChristmasRingStatus) => {
        set((state) => ({ ...state, ringStatus: status }));
      },
      set: (state) => {
        set((prev) => ({ ...prev, ...state }));
      }
    }),
    {
      name: "_BERATOWN_Christmas_STORAGE",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ ringStatus: state.ringStatus } as any)
    }
  )
);
