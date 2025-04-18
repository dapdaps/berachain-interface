import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export const useBearEqu = create(
  persist(
    (set, get: any) => ({
      hat: -1,
      cloth: -1,
      car: -1,
      necklace: -1,
      pet: -1,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_caveBear',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
