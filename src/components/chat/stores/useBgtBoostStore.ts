import { create } from "zustand";

interface BgtBoostState {
  modalOpen: boolean;
  data: any;
  set: (state: Partial<BgtBoostState>) => void;
}

const useBgtBoostStore = create<BgtBoostState>((set) => ({
  modalOpen: false,
  data: {},
  set: (state) => {
    set((prev) => ({ ...prev, ...state }));
  }
}));

export default useBgtBoostStore;
