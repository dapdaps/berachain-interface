import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface QuestStore {
  visited: Record<number | string, boolean>;
  homePromptVisible: boolean;
  setVisited(params: { id?: number | string; visited?: boolean; account?: string; }): void;
  setUpdate(): void;
  getVisited(params: { id?: number | string; account?: string; }): boolean;
  setHomePromptVisible(visible: boolean): void;
}

export const useQuestStore = create(
  persist<QuestStore>(
    (set, get: any) => ({
      visited: {},
      homePromptVisible: true,
      setVisited: (params) => {
        if (!params.id || !params.account) return;
        const _visited = {
          ...get().visited,
          [`${params.account}-${params.id}`]: params.visited ?? true,
        };
        set((state) => {
          state.visited = _visited;
          return state;
        });
      },
      getVisited: (params) => {
        if (!params.id || !params.account) return false;
        return get().visited[`${params.account}-${params.id}`] ?? false;
      },
      setUpdate: () => {
        const _visited = {
          ...get().visited,
          '_updated': +new Date(),
        };
        set((state) => {
          state.visited = _visited;
          return state;
        });
      },
      setHomePromptVisible: (visible) => {
        set((state) => {
          state.homePromptVisible = visible;
          return state;
        });
      },
    }),
    {
      name: '_activity_christmas_quest',
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
