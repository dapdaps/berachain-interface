import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useBintent = create(
  persist(
    (set, get: any) => ({
      showRankModal: false,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_bintent',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
