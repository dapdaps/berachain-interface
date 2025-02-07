import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export const useBridgeHistory = create(
  persist(
    (set, get: any) => ({
      list: [],
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_bridgeHistory',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
