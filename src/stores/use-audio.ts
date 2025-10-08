import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAudioStore = create(
  persist(
    (set, get: any) => ({
      open: true,
      setOpen: (open: boolean) => set({ open }),
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: "_BERATOWN_AUDIO",
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
