import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useBgtStore = create(
  persist(
    (set, get: any) => ({
      validators: null,
      totalCount: 0,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_bgt',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
