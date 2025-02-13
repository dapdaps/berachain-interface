import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AirdropState {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const useAirdropStore = create(
  persist<AirdropState>(
    (set, get: any) => ({
      visible: false,
      setVisible: (visible) => set({ visible: visible }),
    }),
    {
      name: '_airdrop',
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        visible: state.visible,
      } as any)
    },
  ),
);
