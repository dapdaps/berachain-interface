import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface McBeraStore {
  visible: boolean;
  toggleVisible: (visible?: boolean) => boolean;
}

export const useMcBeraStore = create(
  persist<McBeraStore>(
    (set, get) => ({
      visible: false,
      toggleVisible: (visible) => {
        let _visible = typeof visible === "boolean" ? visible : !get().visible;
        set({ visible: _visible });
        return _visible;
      },
    }),
    {
      name: "_beratown_mc_bera_store",
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({} as any)
    }
  )
);
