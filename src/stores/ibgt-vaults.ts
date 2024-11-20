import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useIbgtVaults = create(
  persist(
    (set, get: any) => ({
      vaults: [],
      berpsVaults: [],
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_vaults',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
