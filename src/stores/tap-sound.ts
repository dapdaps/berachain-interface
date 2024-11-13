import { create } from 'zustand';

type TapSoundState = {
  play(): void;
};

type TapSoundStore = TapSoundState & {
  set: (update: TapSoundState) => void;
};

export const useTapSoundStore = create<TapSoundStore>((set) => ({
  play: () => {},
  set: (params) => set(() => ({ ...params })),
}));
