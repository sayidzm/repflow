import { Ellipsis, Eye, Plus, Trash2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { ActionSheetModal } from '@/components/ui/ActionSheetModal';
import { AppText } from '@/components/ui/AppText';
import type { WorkoutExercise } from '@/domain/models';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';
import { WorkoutSetRow } from './WorkoutSetRow';

type Props = {
  exercise: WorkoutExercise;
  onAddSet: () => void;
  onChangeSet: (setId: string, field: 'weight' | 'reps', value: string) => void;
  onToggleSet: (setId: string) => void;
};

export function ExerciseCard({ exercise, onAddSet, onChangeSet, onToggleSet }: Props) {
  const [optionsVisible, setOptionsVisible] = useState(false);
  const { removeExercise } = useWorkoutDraft();

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText numberOfLines={2} style={styles.title}>{exercise.name}</AppText>
          <AppText style={styles.meta}>{exercise.muscleGroup} · {exercise.category}</AppText>
        </View>
        <Pressable
          accessibilityLabel={`${exercise.name} options`}
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => setOptionsVisible(true)}
          style={styles.options}
        >
          <Ellipsis color={colors.text} size={20} />
        </Pressable>
      </View>

      <View style={styles.labels}>
        <AppText style={[styles.label, styles.setLabel]}>SET</AppText>
        <AppText style={[styles.label, styles.previousLabel]}>ÖNCEKİ</AppText>
        <AppText style={styles.label}>KG</AppText>
        <AppText style={styles.label}>TEKRAR</AppText>
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
        <AppText style={styles.addSetText}>Set ekle</AppText>
      </Pressable>

      <ActionSheetModal
        description={`${exercise.muscleGroup} · ${exercise.category}`}
        onClose={() => setOptionsVisible(false)}
        options={[
          {
            label: 'Gelişimi Görüntüle',
            icon: <Eye color={colors.text} size={18} />,
            onPress: () => router.push(`/exercises/${exercise.id}/progress`),
          },
          {
            label: 'Egzersizi Kaldır',
            icon: <Trash2 color="#ef4444" size={18} />,
            style: 'destructive',
            onPress: () => removeExercise(exercise.id),
          },
        ]}
        title={exercise.name}
        visible={optionsVisible}
      />
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
  labels: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, marginTop: spacing.md, paddingHorizontal: 4 },
  label: { color: colors.muted, flex: 1, fontFamily: typography.mono, fontSize: 8, textAlign: 'center' },
  setLabel: { flex: 0, width: 20 },
  previousLabel: { flex: 0, width: 54 },
  checkSpacer: { width: 44 },
  addSet: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingTop: spacing.sm },
  addSetText: { color: colors.accent, fontFamily: typography.semibold, fontSize: 13 },
});
