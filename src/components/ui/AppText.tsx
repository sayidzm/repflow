import type { ComponentProps } from 'react';
import { Text } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { colors, typography } from '@/theme';

export function AppText({ style, ...props }: ComponentProps<typeof Text>) {
  return <Text {...props} style={[styles.text, style]} />;
}

const styles = createStyles({
  text: {
    color: colors.text,
    fontFamily: typography.body,
  },
});
