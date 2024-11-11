import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useWelcomeStore = create(
  persist(
    (set) => ({
      show: true,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: 'mobile__caveWelcome',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
