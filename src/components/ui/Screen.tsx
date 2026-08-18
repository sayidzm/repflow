import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { colors } from '@/theme';

type ScreenProps = PropsWithChildren<{ bottomInset?: boolean }>;

export function Screen({ children, bottomInset = true }: ScreenProps) {
  return (
    <SafeAreaView edges={bottomInset ? ['top', 'bottom'] : ['top']} style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = createStyles({
  safeArea: { flex: 1, backgroundColor: colors.ink },
  content: { flex: 1 },
});
