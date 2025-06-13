import { create } from "zustand";

interface HaikuState {
  modalOpen: boolean;
  data: any;
  set: (state: Partial<HaikuState>) => void;
}

const useEnsoStore = create<HaikuState>((set) => ({
  modalOpen: false,
  data: {},
  set: (state) => {
    set((prev) => ({ ...prev, ...state }));
  }
}));

export default useEnsoStore;
