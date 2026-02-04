import { Platform } from 'react-native';

export const colors = {
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
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const radii = {
  sm: 8,
  md: 12,
  lg: 20,
  xl: 28,
};

export const shadows = {
  soft: {
    shadowColor: '#0B1021',
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  medium: {
    shadowColor: '#0B1021',
    shadowOpacity: 0.12,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
  },
};

export const fontFamilies = {
  display: Platform.select({ ios: 'AvenirNext-Heavy', android: 'serif', default: 'System' }),
  heading: Platform.select({ ios: 'AvenirNext-DemiBold', android: 'serif', default: 'System' }),
  body: Platform.select({ ios: 'System', android: 'sans-serif', default: 'System' }),
};
