import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface QuestStore {
  visited: Record<number | string, boolean>;
  setVisited(params: { id?: number | string; visited?: boolean; }): void;
  setUpdate(): void;
  getVisited(params: { id?: number | string; account?: string; }): boolean;
}

export const useQuestStore = create(
  persist<QuestStore>(
    (set, get: any) => ({
      visited: {},
      setVisited: (params) => {
        if (!params.id) return;
        const _visited = {
          ...get().visited,
          [params.id]: params.visited ?? true,
        };
        set((state) => state.visited = _visited);
      },
      getVisited: (params) => {
        if (!params.id || !params.account) return false;
        return get().visited[params.id] ?? false;
      },
      setUpdate: () => {
        const _visited = {
          ...get().visited,
          '_updated': +new Date(),
        };
        set((state) => state.visited = _visited);
      },
    }),
    {
      name: '_activity_christmas_quest',
      version: 0.1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
