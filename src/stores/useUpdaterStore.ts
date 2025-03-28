import { create } from 'zustand/index';

interface UpdaterStore {
  updater: number;
  setOpen: (updater: number) => void;
}

const useUpdaterStore = create<UpdaterStore>(
  (set) => ({
    updater: 0,
    setOpen: (updater: number) => set({ updater }),
  })
);

export default useUpdaterStore;
