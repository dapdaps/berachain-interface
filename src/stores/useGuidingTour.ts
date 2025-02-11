import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GuidingTourState {
  hasShownTour: boolean;
  setHasShownTour: (value: boolean) => void;
  // Mainnet guiding tour
  visited: boolean;
  entryVisible: boolean;
  exitConfirmVisible: boolean;
  profileVisible: boolean;
  choosePillVisible: boolean;
  getBeraVisible: boolean;
  doneVisible: boolean;
  setVisited: (visited: boolean) => void;
  setEntryVisible: (visible: boolean) => void;
  setExitConfirmVisible: (visible: boolean) => void;
  setProfileVisible: (visible: boolean) => void;
  setChoosePillVisible: (visible: boolean) => void;
  setGetBeraVisible: (visible: boolean) => void;
  setDoneVisible: (visible: boolean) => void;
}

export const useGuidingTour = create(
  persist<GuidingTourState>(
    (set) => ({
      hasShownTour: false,
      setHasShownTour: (value: boolean) => set({ hasShownTour: value }),
      visited: false,
      entryVisible: true,
      exitConfirmVisible: false,
      profileVisible: false,
      choosePillVisible: false,
      getBeraVisible: false,
      doneVisible: false,
      setVisited: (visited: boolean) => set({ visited: visited }),
      setEntryVisible: (visible: boolean) => set({ entryVisible: visible }),
      setExitConfirmVisible: (visible: boolean) => set({ exitConfirmVisible: visible }),
      setProfileVisible: (visible: boolean) => set({ profileVisible: visible }),
      setChoosePillVisible: (visible: boolean) => set({ choosePillVisible: visible }),
      setGetBeraVisible: (visible: boolean) => set({ getBeraVisible: visible }),
      setDoneVisible: (visible: boolean) => set({ doneVisible: visible }),
    }),
    {
      name: '_guidingTour',
      version: 0.2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasShownTour: state.hasShownTour,
        visited: state.visited,
      } as any)
    }
  )
);

