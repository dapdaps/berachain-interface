import { ChainType } from '@/sections/near-intents/hooks/useConnectWallet';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WalletState {
  chainType: ChainType;
  address?: string;
  [key: string]: any; 
}

interface ConnectedWalletsStore {
  connectedWallets: WalletState[];
  addWallet: (state: WalletState) => void;
  removeWallet: (chainType: ChainType) => void;
  isWalletConnected: (chainType: ChainType) => boolean;
  getWalletState: (chainType: ChainType) => WalletState | undefined;
}

export const useConnectedWalletsStore = create<ConnectedWalletsStore>()(
  persist(
    (set, get) => ({
      connectedWallets: [],

      addWallet: (state) => {
        set((current) => {
          const existingIndex = current.connectedWallets.findIndex(
            w => w.chainType === state.chainType
          );
          
          if (existingIndex >= 0) {
            // 如果钱包已存在，先移除旧的
            const newWallets = current.connectedWallets.filter(
              w => w.chainType !== state.chainType
            );
            // 将更新的钱包状态添加到最前面
            return { 
              connectedWallets: [state, ...newWallets]
            };
          }
          
          // 新钱包直接添加到最前面
          return {
            connectedWallets: [state, ...current.connectedWallets],
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
      name: 'connected-wallets-storage_v1.0.0',
    }
  )
);
