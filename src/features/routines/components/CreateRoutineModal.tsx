import { Check, Plus, X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import type { Routine } from '@/domain/models/routine';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (input: { name: string; exerciseIds: string[] }) => Promise<void>;
  initialRoutine?: Routine | null;
};

export function CreateRoutineModal({ visible, onClose, onSubmit, initialRoutine }: Props) {
  const insets = useSafeAreaInsets();
  const { exercises: allExercises } = useExercises();

  const [name, setName] = useState(initialRoutine?.name ?? '');
  const [selectedIds, setSelectedIds] = useState<string[]>(
    initialRoutine ? initialRoutine.exercises.map((e) => e.exerciseId) : [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleSelectExercise = (exerciseId: string) => {
    setSelectedIds((prev) =>
      prev.includes(exerciseId) ? prev.filter((id) => id !== exerciseId) : [...prev, exerciseId],
    );
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Routine name is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit({ name: trimmed, exerciseIds: selectedIds });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save routine');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingTop: Math.max(insets.top, spacing.md), paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.header}>
            <IconButton accessibilityLabel="Close routine editor" onPress={onClose}>
              <X color={colors.text} size={20} />
            </IconButton>
            <AppText style={styles.title}>{initialRoutine ? 'Edit Routine' : 'New Routine'}</AppText>
            <Pressable
              accessibilityRole="button"
              disabled={isSubmitting || !name.trim()}
              onPress={handleSave}
              style={[styles.saveBtn, (!name.trim() || isSubmitting) && styles.saveBtnDisabled]}
            >
              <AppText style={styles.saveBtnText}>{isSubmitting ? 'Saving...' : 'Save'}</AppText>
            </Pressable>
          </View>

          {error && <AppText style={styles.errorText}>{error}</AppText>}

          <View style={styles.formGroup}>
            <AppText style={styles.label}>ROUTINE NAME</AppText>
            <TextInput
              accessibilityLabel="Routine name"
              onChangeText={setName}
              placeholder="e.g. Upper Body Power"
              placeholderTextColor={colors.muted}
              style={styles.input}
              value={name}
            />
          </View>

          <AppText style={styles.sectionLabel}>SELECT EXERCISES ({selectedIds.length})</AppText>
          <ScrollView contentContainerStyle={styles.exerciseList}>
            {allExercises.map((ex) => {
              const isSelected = selectedIds.includes(ex.id);
              return (
                <Pressable
                  accessibilityLabel={`Select ${ex.name}`}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isSelected }}
                  key={ex.id}
                  onPress={() => toggleSelectExercise(ex.id)}
                  style={[styles.exerciseRow, isSelected && styles.exerciseRowSelected]}
                >
                  <View style={styles.exerciseInfo}>
                    <AppText style={styles.exerciseName}>{ex.name}</AppText>
                    <AppText style={styles.exerciseMeta}>{ex.muscleGroup} · {ex.category}</AppText>
                  </View>
                  <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                    {isSelected ? <Check color={colors.ink} size={14} strokeWidth={3} /> : <Plus color={colors.muted} size={14} />}
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = createStyles({
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)', flex: 1, justifyContent: 'flex-end' },
  container: { backgroundColor: colors.ink, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, flex: 1, marginTop: 40 },
  header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  title: { fontFamily: typography.bold, fontSize: 17 },
  saveBtn: { backgroundColor: colors.accent, borderRadius: radius.md, minHeight: 40, paddingHorizontal: spacing.md, justifyContent: 'center' },
  saveBtnDisabled: { opacity: 0.45 },
  saveBtnText: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  errorText: { color: '#ef4444', fontFamily: typography.regular, fontSize: 12, marginHorizontal: spacing.md, marginTop: spacing.sm },
  formGroup: { paddingHorizontal: spacing.md, paddingTop: spacing.md },
  label: { color: colors.muted, fontFamily: typography.mono, fontSize: 10, marginBottom: 6 },
  input: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontFamily: typography.semibold, fontSize: 15, height: 50, paddingHorizontal: spacing.md },
  sectionLabel: { color: colors.muted, fontFamily: typography.mono, fontSize: 10, paddingHorizontal: spacing.md, paddingTop: spacing.lg, paddingBottom: spacing.xs },
  exerciseList: { gap: spacing.xs, paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  exerciseRow: { alignItems: 'center', backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', minHeight: 56, paddingHorizontal: spacing.md },
  exerciseRowSelected: { borderColor: colors.accent },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontFamily: typography.bold, fontSize: 14 },
  exerciseMeta: { color: colors.muted, fontFamily: typography.regular, fontSize: 11, marginTop: 2 },
  checkbox: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.sm, borderWidth: 1, height: 26, justifyContent: 'center', width: 26 },
  checkboxSelected: { backgroundColor: colors.accent, borderColor: colors.accent },
});
