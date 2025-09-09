import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useNftReward = create(
  persist(
    (set, get: any) => ({
      showNftReward: false,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_nft_reward',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
