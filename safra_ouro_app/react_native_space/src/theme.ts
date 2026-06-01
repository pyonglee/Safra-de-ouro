import { Platform } from 'react-native';

export const colors = {
  primary: '#6B4226',
  primaryLight: '#8D6E63',
  accent: '#D4A017',
  accentLight: '#F9C846',
  success: '#2E7D32',
  error: '#C62828',
  background: '#FAF6F1',
  surface: '#FFFFFF',
  surfaceSecondary: '#F5EFE6',
  textPrimary: '#3E2723',
  textSecondary: '#795548',
  border: '#D7CCC8',
  disabled: '#BDBDBD',
  white: '#FFFFFF',
  black: '#000000',
  overlay: 'rgba(0,0,0,0.5)',
  gradientPrimary: ['#6B4226', '#8D6E63'] as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const fonts = {
  heading: Platform.select({ ios: 'System', android: 'Roboto', default: 'Arial, sans-serif' }) ?? 'System',
  body: Platform.select({ ios: 'System', android: 'Roboto', default: 'Arial, sans-serif' }) ?? 'System',
} as const;

export const shadows = Platform.select({
  ios: {
    card: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    cardElevated: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
  },
  android: {
    card: { elevation: 2 },
    cardElevated: { elevation: 4 },
  },
  default: {
    card: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
    },
    cardElevated: {
      shadowColor: '#3E2723',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 12,
    },
  },
}) ?? { card: { elevation: 2 }, cardElevated: { elevation: 4 } };
