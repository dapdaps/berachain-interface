import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";



export const useBeraciaga = create(
  persist(
    (set) => ({
      openModal: false,
      set: (state) => {
        set((prev) => ({ ...prev, ...state }));
      }
    }),
  )
);
