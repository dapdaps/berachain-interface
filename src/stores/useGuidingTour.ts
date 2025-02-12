import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface GuidingTourState {
  hasShownTour: boolean;
  setHasShownTour: (value: boolean) => void;
  // Mainnet guiding tour
  visited: Record<string, boolean>;
  exitConfirmVisible: boolean;
  profileVisible: boolean;
  choosePillVisible: boolean;
  getBeraVisible: boolean;
  doneVisible: boolean;
  setVisited: (account?: string, visited?: boolean) => void;
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
      visited: {},
      exitConfirmVisible: false,
      profileVisible: false,
      choosePillVisible: false,
      getBeraVisible: false,
      doneVisible: false,
      setVisited: (account, visited) => {
        set((state) => {
          const _visited = { ...state.visited };
          if (!account) account = 'DEFAULT';
          _visited[account] = visited ?? false;
          return { visited: _visited };
        });
      },
      setExitConfirmVisible: (visible: boolean) => set({ exitConfirmVisible: visible }),
      setProfileVisible: (visible: boolean) => set({ profileVisible: visible }),
      setChoosePillVisible: (visible: boolean) => set({ choosePillVisible: visible }),
      setGetBeraVisible: (visible: boolean) => set({ getBeraVisible: visible }),
      setDoneVisible: (visible: boolean) => set({ doneVisible: visible }),
    }),
    {
      name: '_guidingTour',
      version: 0.3,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        hasShownTour: state.hasShownTour,
        visited: state.visited,
      } as any)
    }
  )
);

