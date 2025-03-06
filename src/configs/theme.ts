export interface ThemeConfig {
  primaryColor: string;
  earthBackgroundColor: string;
}

export const defaultTheme: ThemeConfig = {
  primaryColor: '#96d6ff',
  earthBackgroundColor: '#B6DF5D'
};

export const themeConfigs: Record<string, ThemeConfig> = {
  lgbt: {
    primaryColor: '#F990D2',
    earthBackgroundColor: '#85C0FF'
  }
};
