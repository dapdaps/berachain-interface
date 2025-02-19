import { create } from 'zustand';
import { defaultTheme, themeConfigs, ThemeConfig } from '@/configs/theme';

interface ActivityState {
  activeTheme: 'default' | 'lgbt';
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  isDefaultTheme: () => boolean;
}

export const useActivityStore = create<ActivityState>((set, get) => ({
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
}));