import { create } from "zustand";

interface EnsoState {
  modalOpen: boolean;
  data: any;
  set: (state: Partial<EnsoState>) => void;
}

const useEnsoStore = create<EnsoState>((set) => ({
  modalOpen: false,
  data: {},
  set: (state) => {
    set((prev) => ({ ...prev, ...state }));
  }
}));

export default useEnsoStore;
