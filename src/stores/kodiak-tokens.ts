import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useKodiakTokensStore = create(
  persist(
    (set, get: any) => ({
      tokens: {},
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "kodiak-tokens",
      version: 0.12,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
