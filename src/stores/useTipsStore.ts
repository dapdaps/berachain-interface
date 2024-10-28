import { create } from 'zustand/index';
import { createJSONStorage, persist } from 'zustand/middleware';

const useTipsStore = create(
  persist((set) => ({
    open: true,
    setOpen: (open: boolean) => set({ open }),
  }),{
    name: '_berachain-tips',
    version: 0.1,
    storage: createJSONStorage(() => sessionStorage)
  })
);

export default useTipsStore;
