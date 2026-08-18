import { Play } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing, typography } from '@/theme';

type Props = { name: string; exercises: readonly string[]; last: string; onStart: () => void };

export function RoutineCard({ name, exercises, last, onStart }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <AppText style={styles.name}>{name}</AppText>
        <AppText style={styles.count}>{exercises.length + 2} Exercises</AppText>
      </View>
      <View style={styles.list}>{exercises.map((exercise) => <AppText key={exercise} style={styles.exercise}>{exercise}</AppText>)}</View>
      <View style={styles.footer}>
        <AppText style={styles.last}>Last performed {last}</AppText>
        <Pressable accessibilityLabel={`Start ${name}`} accessibilityRole="button" onPress={onStart} style={styles.start}>
          <AppText style={styles.startText}>Start</AppText>
          <Play color={colors.ink} fill={colors.ink} size={13} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = createStyles({
  card: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  heading: { alignItems: 'baseline', flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontFamily: typography.bold, fontSize: 20 },
  count: { color: colors.muted, fontFamily: typography.mono, fontSize: 9, textTransform: 'uppercase' },
  list: { borderBottomColor: colors.line, borderBottomWidth: 1, borderTopColor: colors.line, borderTopWidth: 1, gap: 7, marginVertical: spacing.md, paddingVertical: spacing.md },
  exercise: { color: colors.muted, fontFamily: typography.regular, fontSize: 13 },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  last: { color: colors.muted, flex: 1, fontFamily: typography.regular, fontSize: 10 },
  start: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingHorizontal: spacing.md },
  startText: { color: colors.ink, fontFamily: typography.bold, fontSize: 12 },
});
