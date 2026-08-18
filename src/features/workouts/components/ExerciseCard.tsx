import { Ellipsis, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import type { WorkoutExercise } from '@/domain/models';
import { colors, radius, spacing, typography } from '@/theme';
import { WorkoutSetRow } from './WorkoutSetRow';

type Props = {
  exercise: WorkoutExercise;
  onAddSet: () => void;
  onChangeSet: (setId: string, field: 'weight' | 'reps', value: string) => void;
  onToggleSet: (setId: string) => void;
};

export function ExerciseCard({ exercise, onAddSet, onChangeSet, onToggleSet }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText numberOfLines={2} style={styles.title}>{exercise.name}</AppText>
          <AppText style={styles.meta}>{exercise.muscleGroup} · {exercise.category}</AppText>
        </View>
        <Pressable accessibilityLabel={`${exercise.name} options`} accessibilityRole="button" hitSlop={10} style={styles.options}>
          <Ellipsis color={colors.muted} size={20} />
        </Pressable>
      </View>
      <AppText style={styles.last}>Last: <AppText style={styles.lastValue}>60 kg × 8</AppText></AppText>
      <View style={styles.labels}>
        <AppText style={[styles.label, styles.setLabel]}>SET</AppText>
        <AppText style={[styles.label, styles.previousLabel]}>PREVIOUS</AppText>
        <AppText style={styles.label}>KG</AppText>
        <AppText style={styles.label}>REPS</AppText>
        <View style={styles.checkSpacer} />
      </View>
      {exercise.sets.map((set: WorkoutExercise['sets'][number], index: number) => (
        <WorkoutSetRow
          index={index}
          key={set.id}
          onChange={(field, value) => onChangeSet(set.id, field, value)}
          onToggle={() => onToggleSet(set.id)}
          set={set}
        />
      ))}
      <Pressable accessibilityRole="button" onPress={onAddSet} style={styles.addSet}>
        <Plus color={colors.accent} size={16} />
        <AppText style={styles.addSetText}>Add set</AppText>
      </Pressable>
    </View>
  );
}

const styles = createStyles({
  card: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  heading: { alignItems: 'flex-start', flexDirection: 'row' },
  headingCopy: { flex: 1 },
  title: { fontFamily: typography.bold, fontSize: 19, letterSpacing: -0.4 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, marginTop: 3 },
  options: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: -10, marginTop: -10, width: 44 },
  last: { color: colors.muted, fontFamily: typography.regular, fontSize: 11, marginTop: spacing.md },
  lastValue: { color: colors.text, fontFamily: typography.semibold },
  labels: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md, paddingHorizontal: 4 },
  label: { color: colors.muted, flex: 1, fontFamily: typography.mono, fontSize: 8, textAlign: 'center' },
  setLabel: { flex: 0, width: 20 },
  previousLabel: { flex: 0, width: 54 },
  checkSpacer: { width: 44 },
  addSet: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingTop: spacing.sm },
  addSetText: { color: colors.accent, fontFamily: typography.semibold, fontSize: 13 },
});
