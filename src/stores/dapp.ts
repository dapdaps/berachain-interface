import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useDappStore = create(
  persist(
    (set, get: any) => ({
      dapp: null,
      set: (params: any) => set(() => ({ ...params })),
    }),
    {
      name: '_current_dapp',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
