import { create } from 'zustand';
import { NFTCollectionWithStatus } from '../types';

interface ListState {
  collections: NFTCollectionWithStatus[];
  isLoading: boolean;
  error: string | null;
  setCollections: (collections: NFTCollectionWithStatus[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useListStore = create<ListState>((set) => ({
  collections: [],
  isLoading: false,
  error: null,
  setCollections: (collections) => set({ collections }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error })
}));