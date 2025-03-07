import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useOogaTokensStore = create(
  persist(
    (set, get: any) => ({
      tokens: {},
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "ooga-tokens",
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
