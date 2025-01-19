import { createStore } from 'zustand';
import { ChainType } from '../sections/near-intents/hooks/useConnectWallet';

interface StoreState {
  chainType?: ChainType;
  network?: string;
  address?: string;
}

interface Actions {
  setState: (state: StoreState) => void;
  clear: () => void;
}

export const useNearConnectStore = createStore<StoreState & Actions>((set) => ({
  chainType: undefined,
  network: undefined,
  address: undefined,
  setState: (state) => set(state),
  clear: () => set({ chainType: undefined, network: undefined, address: undefined }),
}));
