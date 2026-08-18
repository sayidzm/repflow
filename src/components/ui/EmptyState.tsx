import { View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from './AppText';
import { colors, spacing, typography } from '@/theme';

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <View accessibilityRole="summary" style={styles.container}>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.message}>{message}</AppText>
    </View>
  );
}

const styles = createStyles({
  container: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingVertical: 56 },
  title: { fontFamily: typography.bold, fontSize: 18 },
  message: { color: colors.muted, fontFamily: typography.regular, lineHeight: 21, marginTop: spacing.sm, textAlign: 'center' },
});
