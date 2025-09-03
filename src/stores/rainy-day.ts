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
  isWeatherOpen?: boolean;
};

type RainyDayStore = RainyDayState & {
  setRainyDay: (scene: Scene) => void;
  setBeraPrice: (price: BeraPrice) => void;
  setIsWeatherOpen: (isWeatherOpen: boolean) => void;
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
  excludePathname: ['/cave', '/vaults', '/belong'],
};

export const useRainyDayStore = create(
  persist<RainyDayStore>(
    (set) => ({
      rainyDay: RAINY_DAY,
      beraPrice: {},
      isWeatherOpen: true,
      setRainyDay: (scene) => {
        set((state) => ({ ...state, rainyDay: scene }));
      },
      setBeraPrice: (price) => {
        set((state) => ({
          ...state,
          beraPrice: { ...state.beraPrice, ...price },
        }));
      },
      setIsWeatherOpen: (isWeatherOpen) => {
        set((state) => ({ ...state, isWeatherOpen }));
      },
    }),
    {
      name: "_rainyDay",
      version: 0.2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        rainyDay: state.rainyDay,
        isWeatherOpen: state.isWeatherOpen,
      } as any)
    }
  )
);
