import { ChainType } from '@/sections/near-intents/hooks/useConnectWallet';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface WalletState {
  chainType: ChainType;
  address?: string;
  timestamp?: number; 
  [key: string]: any; 
}

interface ConnectedWalletsStore {
  connectedWallets: WalletState[];
  addWallet: (state: WalletState) => void;
  removeWallet: (chainType: ChainType) => void;
  isWalletConnected: (chainType: ChainType) => boolean;
  getWalletState: (chainType: ChainType) => WalletState | undefined;
}


export const useConnectedWalletsStore = create(
  // @ts-ignore
  persist<ConnectedWalletsStore>(
    (set, get) => ({
      connectedWallets: [],

      addWallet: (state) => {
        set((current) => {
          const existingWallet = current.connectedWallets.find(
            w => w.chainType === state.chainType
          );
          
          let updatedWallets;
          if (existingWallet) {
            const newWallets = current.connectedWallets.filter(
              w => w.chainType !== state.chainType
            );
            const updatedWallet = {
              ...state,
              timestamp: existingWallet.timestamp 
            };
            updatedWallets = [...newWallets, updatedWallet];
          } else {
            const newWallet = {
              ...state,
              timestamp: Date.now()
            };
            updatedWallets = [...current.connectedWallets, newWallet];
          }
          
          return {
            connectedWallets: updatedWallets.sort((a, b) => 
              (b.timestamp || 0) - (a.timestamp || 0)
            )
          };
        });
      },

      removeWallet: (chainType) => {
        set((state) => ({
          connectedWallets: state.connectedWallets.filter(
            w => w.chainType !== chainType
          ),
        }));
      },

      isWalletConnected: (chainType) => {
        return get().connectedWallets.some(w => w.chainType === chainType);
      },

      getWalletState: (chainType) => {
        return get().connectedWallets.find(w => w.chainType === chainType);
      }
    }),
    {
      name: 'connected-wallets-storage_v1.0.3',
      storage: createJSONStorage(() => sessionStorage)
    }
  )
)
