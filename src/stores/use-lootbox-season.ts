import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface LootboxSeasonState {
  visited: Record<string, boolean>;
  setVisited: (account?: string, visited?: boolean) => void;
  treasureBookOpen: boolean;
  setTreasureBookOpen: (open?: boolean) => void;
  treasureBookTab: string;
  setTreasureBookTab: (tab?: string) => void;
  guideVisited: Record<string, boolean>;
  setGuideVisited: (account?: string, visited?: boolean) => void;
}

export const useLootboxSeasonStore = create(
  persist<LootboxSeasonState>(
    (set, get: any) => ({
      visited: {},
      setVisited: (account, visited) => {
        set((state) => {
          const _visited = { ...state.visited };
          if (!account) {
            account = 'DEFAULT';
          } else {
            if (visited) {
              _visited['DEFAULT'] = visited;
            }
          }
          _visited[account] = visited ?? false;
          return { visited: _visited };
        });
      },
      treasureBookOpen: false,
      setTreasureBookOpen: (open) => set({ treasureBookOpen: !!open }),
      treasureBookTab: "beratown",
      setTreasureBookTab: (tab) => set({ treasureBookTab: tab }),
      guideVisited: {},
      setGuideVisited: (account, visited) => {
        set((state) => {
          const _guideVisited = { ...state.guideVisited };
          if (!account) {
            account = 'DEFAULT';
          } else {
            if (visited) {
              _guideVisited['DEFAULT'] = visited;
            }
          }
          _guideVisited[account] = visited ?? false;
          return { guideVisited: _guideVisited };
        });
      },
    }),
    {
      name: '_BERATOWN_LOOTBOX_SEASON',
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        visited: state.visited,
        guideVisited: state.guideVisited,
      } as any)
    },
  ),
);
