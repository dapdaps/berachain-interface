import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { asyncFetch } from '@/utils/http';
import oneClickService from '@/sdk/oneclick';

// Zero address for native tokens
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export interface OneClickToken {
  assetId: string;
  decimals: number;
  blockchain: string;
  symbol: string;
  price: number;
  priceUpdatedAt: string;
  contractAddress: string;
}

type OneClickTokenStore = {
  tokens: OneClickToken[];
  loading: boolean;
  error: string | null;
  fetchTokens: () => Promise<void>;
};

export const useOneClickTokenStore = create<OneClickTokenStore>()(
  persist(
    (set) => ({
      tokens: [],
      loading: false,
      error: null,
      fetchTokens: async () => {
        set({ loading: true, error: null });
        try {
          const data: any = await oneClickService.getTokens();

          // Process tokens: add zero address for native tokens without contractAddress
          const processedTokens: OneClickToken[] = (data?.data || []).map((token: any) => ({
            ...token,
            contractAddress: token.contractAddress || ZERO_ADDRESS,
          }));

          set({ tokens: processedTokens, loading: false, error: null });
        } catch (error: any) {
          set({
            tokens: [],
            loading: false,
            error: error?.message || 'Failed to fetch tokens'
          });
          console.error('Failed to fetch OneClick tokens:', error);
        }
      },
    }),
    {
      name: "oneclick-tokens",
      version: 1,
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        tokens: state.tokens,
        loading: state.loading,
      }),
    }
  )
);

