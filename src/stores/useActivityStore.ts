import { create } from 'zustand';
import { defaultTheme, themeConfigs, ThemeConfig } from '@/configs/theme';
import { createJSONStorage, persist } from 'zustand/middleware';

interface ActivityState {
  activeTheme: 'default' | 'lgbt';
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  isDefaultTheme: () => boolean;
}

export const useActivityStore = create(persist<ActivityState>((set, get) => ({
  activeTheme: 'default',
  themeConfig: defaultTheme,

  toggleTheme: () => {
    const current = get().activeTheme;
    if (current === 'default') {
      set({
        activeTheme: 'lgbt',
        themeConfig: themeConfigs.lgbt
      });
    } else {
      set({
        activeTheme: 'default',
        themeConfig: defaultTheme
      });
    }
  },

  isDefaultTheme: () => {
    return get().activeTheme === 'default';
  }
}), {
  name: 'activity-store',
  version: 0.1,
  storage: createJSONStorage(() => localStorage),
}));