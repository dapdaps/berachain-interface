import { create } from "zustand";

interface SwapState {
  isSwapModalOpen: boolean;
  defaultInputCurrency: any | null;
  defaultOutputCurrency: any | null;
  openSwapModal: () => void;
  closeSwapModal: () => void;
  setDefaultInputCurrency: (currency: any) => void;
  setDefaultOutputCurrency: (currency: any) => void;
}

const useSwapStore = create<SwapState>((set) => ({
    isSwapModalOpen: false,
    defaultInputCurrency: null,
    defaultOutputCurrency: null,
    openSwapModal: () => set({ isSwapModalOpen: true }),
    closeSwapModal: () => set({ isSwapModalOpen: false }),
    setDefaultInputCurrency: (currency: any) => set({ defaultInputCurrency: currency }),
    setDefaultOutputCurrency: (currency: any) => set({ defaultOutputCurrency: currency })
}));

export default useSwapStore;