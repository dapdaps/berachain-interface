import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useInviteModal = create(
  persist(
    (set, get: any) => ({
      showInviteModal: false,
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_invite_modal',
      version: 0.1,
      storage: createJSONStorage(() => sessionStorage)
    }
  )
);
