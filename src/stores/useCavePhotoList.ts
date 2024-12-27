import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';


export const useCavePhotoList = create(
  persist(
    (set, get: any) => ({
      photoList: [null, null],
      set: (params: any) => set(() => ({ ...params }))
    }),
    {
      name: '_cavePhotoList',
      version: 0.1,
      storage: createJSONStorage(() => localStorage)
    }
  )
);
