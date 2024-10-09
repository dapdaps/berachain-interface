import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';

const useMapModalStore = create(
  persist((set) => ({
      open: false,
      setOpen: (open: boolean) => set({ open }),
    }),{
    name: 'map-opened',
    version: 0.1,
    storage: createJSONStorage(() => localStorage)
  })
);

export default useMapModalStore;