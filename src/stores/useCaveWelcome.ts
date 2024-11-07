import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useCaveWelcome = create(
  persist(
    (set, get: any) => ({
      welcomeShow: true,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_caveWelcome',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
