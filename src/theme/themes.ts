export type ThemeName = 'light' | 'dark' | 'solar' | 'mono';

export type ThemeColors = {
  primary: string;
  primaryDark: string;
  accent: string;
  accentDark: string;
  success: string;
  danger: string;
  text: string;
  textLight: string;
  muted: string;
  border: string;
  background: string;
  surface: string;
  card: string;
  ink: string;
  info: string;
};

export type AppTheme = {
  name: ThemeName;
  colors: ThemeColors;
  statusBar: 'light-content' | 'dark-content';
};

export const themes: Record<ThemeName, AppTheme> = {
  light: {
    name: 'light',
    statusBar: 'dark-content',
    colors: {
      primary: '#2B6EF6',
      primaryDark: '#1B49B6',
      accent: '#FFB547',
      accentDark: '#D6801C',
      success: '#20B26B',
      danger: '#E5484D',
      text: '#0B1021',
      textLight: '#1F2A44',
      muted: '#6B7280',
      border: '#E4E7EC',
      background: '#F7F8FB',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      ink: '#0B0F1A',
      info: '#5B8CFF',
    },
  },
  dark: {
    name: 'dark',
    statusBar: 'light-content',
    colors: {
      primary: '#5B8CFF',
      primaryDark: '#2B6EF6',
      accent: '#FFB547',
      accentDark: '#D6801C',
      success: '#2AD17A',
      danger: '#FF5C61',
      text: '#F5F7FF',
      textLight: 'rgba(245,247,255,0.86)',
      muted: 'rgba(245,247,255,0.60)',
      border: 'rgba(255,255,255,0.10)',
      background: '#0B0F1A',
      surface: '#12162A',
      card: '#151A2E',
      ink: '#060A12',
      info: '#7AA0FF',
    },
  },
  solar: {
    name: 'solar',
    statusBar: 'dark-content',
    colors: {
      primary: '#D6801C',
      primaryDark: '#A85A10',
      accent: '#FFB547',
      accentDark: '#D6801C',
      success: '#1F9E63',
      danger: '#D9483A',
      text: '#2C1E00',
      textLight: '#3A2A00',
      muted: 'rgba(44,30,0,0.55)',
      border: '#F2D7A6',
      background: '#FFF6E3',
      surface: '#FFFCF2',
      card: '#FFFFFF',
      ink: '#201400',
      info: '#B86B14',
    },
  },
  mono: {
    name: 'mono',
    statusBar: 'dark-content',
    colors: {
      primary: '#111827',
      primaryDark: '#0B1021',
      accent: '#6B7280',
      accentDark: '#374151',
      success: '#111827',
      danger: '#111827',
      text: '#0B1021',
      textLight: '#111827',
      muted: '#6B7280',
      border: '#D1D5DB',
      background: '#F5F6F7',
      surface: '#FFFFFF',
      card: '#FFFFFF',
      ink: '#0B0F1A',
      info: '#374151',
    },
  },
};

export function getTheme(name: ThemeName) {
  return themes[name] ?? themes.light;
}

