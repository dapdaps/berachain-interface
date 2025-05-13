import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useHall = create(
  persist(
    (set, get: any) => ({
      currentTab: "",
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_hall',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
