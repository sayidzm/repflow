import { ChevronRight, Dumbbell } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing, typography } from '@/theme';

type Props = { name: string; detail?: string; duration: string; onPress: () => void };

export function HistoryWorkoutRow({ name, detail, duration, onPress }: Props) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={(state) => [styles.row, state.pressed && styles.pressed]}>
      <View style={styles.icon}><Dumbbell color={colors.accent} size={18} /></View>
      <View style={styles.copy}>
        <AppText style={styles.name}>{name}</AppText>
        <AppText style={styles.detail}>{detail}</AppText>
      </View>
      <AppText style={styles.duration}>{duration}</AppText>
      <ChevronRight color={colors.muted} size={17} />
    </Pressable>
  );
}

const styles = createStyles({
  row: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72 },
  pressed: { opacity: 0.72 },
  icon: { alignItems: 'center', backgroundColor: colors.panelRaised, borderRadius: radius.pill, height: 42, justifyContent: 'center', marginRight: spacing.sm, width: 42 },
  copy: { flex: 1 },
  name: { fontFamily: typography.bold, fontSize: 14 },
  detail: { color: colors.muted, fontFamily: typography.regular, fontSize: 10, marginTop: 3 },
  duration: { color: colors.text, fontFamily: typography.mono, fontSize: 10, marginHorizontal: spacing.sm },
});
