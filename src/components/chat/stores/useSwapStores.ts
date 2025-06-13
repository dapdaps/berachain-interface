import { create } from "zustand";

interface SwapState {
  isSwapModalOpen: boolean;
  defaultInputCurrency: any | null;
  defaultOutputCurrency: any | null;
  successCb?: () => void;
  openSwapModal: (successCb?: VoidFunction) => void;
  closeSwapModal: () => void;
  setDefaultInputCurrency: (currency: any) => void;
  setDefaultOutputCurrency: (currency: any) => void;
}

const useSwapStore = create<SwapState>((set) => ({
  isSwapModalOpen: false,
  defaultInputCurrency: null,
  defaultOutputCurrency: null,
  openSwapModal: (successCb?: VoidFunction) =>
    set({ isSwapModalOpen: true, successCb }),
  closeSwapModal: () =>
    set({
      isSwapModalOpen: false,
      defaultInputCurrency: null,
      defaultOutputCurrency: null
    }),
  setDefaultInputCurrency: (currency: any) =>
    set({ defaultInputCurrency: currency }),
  setDefaultOutputCurrency: (currency: any) =>
    set({ defaultOutputCurrency: currency })
}));

export default useSwapStore;
