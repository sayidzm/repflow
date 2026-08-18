import type { ComponentProps } from 'react';
import { Text } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { colors, typography } from '@/theme';

export function Label({ style, ...props }: ComponentProps<typeof Text>) {
  return <Text {...props} style={[styles.label, style]} />;
}

const styles = createStyles({
  label: {
    color: colors.muted,
    fontFamily: typography.mono,
    fontSize: 10,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
});
