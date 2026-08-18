import { Platform } from 'react-native';

export const colors = {
  ink: '#121413',
  panel: '#1b1e1c',
  panelRaised: '#252925',
  line: 'rgba(243,247,237,0.12)',
  muted: '#99a099',
  text: '#f5f7ef',
  accent: '#d9f44a',
  success: '#76d1a0',
} as const;

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const typography = {
  body: 'Manrope_500Medium',
  regular: 'Manrope_400Regular',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
  mono: 'DMMono_500Medium',
} as const;

export const shadows = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
  },
  android: { elevation: 8 },
  default: {},
});

export const motion = {
  fast: 140,
  normal: 220,
} as const;
