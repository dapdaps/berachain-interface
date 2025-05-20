import { create } from "zustand";

interface SwapState {
  isSwapModalOpen: boolean;
  defaultInputCurrency: any | null;
  openSwapModal: () => void;
  closeSwapModal: () => void;
  setDefaultInputCurrency: (currency: any) => void;
}

const useSwapStore = create<SwapState>((set) => ({
    isSwapModalOpen: false,
    defaultInputCurrency: null,
    openSwapModal: () => set({ isSwapModalOpen: true }),
    closeSwapModal: () => set({ isSwapModalOpen: false }),
    setDefaultInputCurrency: (currency: any) => set({ defaultInputCurrency: currency })
}));

export default useSwapStore;