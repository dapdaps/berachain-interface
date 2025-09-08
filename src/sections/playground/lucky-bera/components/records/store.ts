import { create } from "zustand";

interface LuckyBeraRecordsState {
  resultsPage: number;
  resultsWinOnly: boolean;
  rechargePage: number;
  setResultsPage: (page: number) => void;
  setResultsWinOnly: (winOnly?: boolean) => void;
  setRechargePage: (page: number) => void;
}

export const useLuckyBeraRecordsStore = create<LuckyBeraRecordsState>((set) => ({
  resultsPage: 1,
  setResultsPage: (page) => set({ resultsPage: page }),
  resultsWinOnly: false,
  setResultsWinOnly: (winOnly) => set({ resultsWinOnly: !!winOnly }),
  rechargePage: 1,
  setRechargePage: (page) => set({ rechargePage: page }),
}));
