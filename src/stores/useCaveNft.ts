import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export const useCaveNft = create(
  persist(
    (set, get: any) => ({
      nft: null,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_caveNft',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
