import Big from 'big.js';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get: any) => ({
      user: {},
      accessToken: {
        access_token: '',
        refresh_access_token: '',
        token_type: 'bearer',
      },
      accessTokenLoading: false,
      loading: false,
      set: (params: any) => set(() => ({ ...params })),
      addUserGemAmount: (amount: number) => {
        set((state: any) => {
          return {
            user: {
              ...state.user,
              gem: Big(state.user.gem || 0).plus(amount || 0).toNumber(),
            },
          };
        });
      },
    }),
    {
      name: '_user',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
