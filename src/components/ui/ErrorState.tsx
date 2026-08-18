import { AlertTriangle, RefreshCw } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from './AppText';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  title?: string;
  message?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = 'Bir Hata Oluştu',
  message = 'Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
  onRetry,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <AlertTriangle color="#ef4444" size={24} />
      </View>
      <AppText style={styles.title}>{title}</AppText>
      <AppText style={styles.message}>{message}</AppText>
      {onRetry && (
        <Pressable accessibilityRole="button" onPress={onRetry} style={styles.retryButton}>
          <RefreshCw color={colors.ink} size={15} />
          <AppText style={styles.retryText}>Tekrar Dene</AppText>
        </Pressable>
      )}
    </View>
  );
}

const styles = createStyles({
  container: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: spacing.xs,
    justify: 'center',
    padding: spacing.xl,
  },
  iconWrapper: {
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    marginBottom: spacing.xs,
    width: 48,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
  retryButton: {
    alignItems: 'center',
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.xs,
    justifyContent: 'center',
    marginTop: spacing.md,
    minHeight: 44,
    paddingHorizontal: spacing.lg,
  },
  retryText: {
    color: colors.ink,
    fontFamily: typography.bold,
    fontSize: 13,
  },
});
