import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Scene } from '@/hooks/use-scene';
import { SceneStatus } from '@/configs/scene';

interface BeraPrice {
  price?: number;
  percentage?: string;
}

type RainyDayState = {
  rainyDay: Scene;
  beraPrice?: BeraPrice;
};

type RainyDayStore = RainyDayState & {
  setRainyDay: (scene: Scene) => void;
  setBeraPrice: (price: BeraPrice) => void;
};

export const RAINY_DAY: Scene = {
  id: 2,
  name: 'Rainy Day',
  description: '',
  path: '',
  status: SceneStatus.Ended,
  api: '',
  bg: '#647783',
  bgPathname: 'ALL',
  excludePathname: ['/cave'],
};

export const useRainyDayStore = create(
  persist<RainyDayStore>(
    (set) => ({
      rainyDay: RAINY_DAY,
      beraPrice: {},
      setRainyDay: (scene) => {
        set((state) => ({ ...state, rainyDay: scene }));
      },
      setBeraPrice: (price) => {
        set((state) => ({
          ...state,
          beraPrice: { ...state.beraPrice, ...price },
        }));
      },
    }),
    {
      name: "_rainyDay",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rainyDay: state.rainyDay,
      } as any)
    }
  )
);
