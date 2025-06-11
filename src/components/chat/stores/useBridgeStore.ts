import { create } from "zustand";

interface BridgeState {
  modalOpen: boolean;
  data: any;
  set: (state: Partial<BridgeState>) => void;
}

const useBridgeStore = create<BridgeState>((set) => ({
  modalOpen: false,
  data: {},
  set: (state) => {
    set((prev) => ({ ...prev, ...state }));
  }
}));

export default useBridgeStore;
