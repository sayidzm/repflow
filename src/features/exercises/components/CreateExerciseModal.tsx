import { X } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import {
  EXERCISE_CATEGORIES,
  MUSCLE_GROUPS,
  type ExerciseCategory,
  type MuscleGroup,
} from '@/domain/models/exercise';
import { validateCreateExerciseInput } from '@/domain/validation/exerciseValidation';
import { colors, radius, spacing, typography } from '@/theme';

export type CreateExerciseModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; muscleGroup: MuscleGroup; category: ExerciseCategory }) => Promise<void>;
};

export function CreateExerciseModal({ visible, onClose, onSubmit }: CreateExerciseModalProps) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('Chest');
  const [category, setCategory] = useState<ExerciseCategory>('Barbell');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setName('');
    setMuscleGroup('Chest');
    setCategory('Barbell');
    setError(null);
    setSubmitting(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSave() {
    setError(null);
    const validationErrors = validateCreateExerciseInput({ name, muscleGroup, category });
    if (validationErrors.length > 0) {
      setError(validationErrors[0].message);
      return;
    }

    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), muscleGroup, category });
      resetForm();
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save exercise.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal animationType="slide" onRequestClose={handleClose} transparent visible={visible}>
      <View style={styles.overlay}>
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
          <View style={styles.header}>
            <AppText style={styles.title}>Yeni Özel Egzersiz</AppText>
            <IconButton accessibilityLabel="Kapat" onPress={handleClose}>
              <X color={colors.text} size={20} />
            </IconButton>
          </View>

          <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
            {error ? <AppText style={styles.errorText}>{error}</AppText> : null}

            <View style={styles.field}>
              <Label>EGZERSİZ ADI</Label>
              <TextInput
                accessibilityLabel="Egzersiz adı girişi"
                autoCapitalize="words"
                onChangeText={(text) => {
                  setName(text);
                  if (error) setError(null);
                }}
                placeholder="Örn. Incline Cable Press"
                placeholderTextColor={colors.muted}
                style={styles.input}
                value={name}
              />
            </View>

            <View style={styles.field}>
              <Label>KAS GRUBU</Label>
              <View style={styles.chipRow}>
                {MUSCLE_GROUPS.map((group) => {
                  const isSelected = muscleGroup === group;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      key={group}
                      onPress={() => setMuscleGroup(group)}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                    >
                      <AppText style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {group}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.field}>
              <Label>KATEGORİ</Label>
              <View style={styles.chipRow}>
                {EXERCISE_CATEGORIES.map((cat) => {
                  const isSelected = category === cat;
                  return (
                    <Pressable
                      accessibilityRole="button"
                      accessibilityState={{ selected: isSelected }}
                      key={cat}
                      onPress={() => setCategory(cat)}
                      style={[styles.chip, isSelected && styles.selectedChip]}
                    >
                      <AppText style={[styles.chipText, isSelected && styles.selectedChipText]}>
                        {cat}
                      </AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable
              accessibilityRole="button"
              disabled={submitting}
              onPress={handleSave}
              style={[styles.saveButton, submitting && styles.disabled]}
            >
              <AppText style={styles.saveButtonText}>
                {submitting ? 'Kaydediliyor...' : 'Egzersizi Kaydet'}
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = createStyles({
  overlay: { backgroundColor: 'rgba(0,0,0,0.65)', flex: 1, justifyContent: 'flex-end' },
  container: { backgroundColor: colors.panelRaised, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, maxHeight: '90%' },
  header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  title: { fontFamily: typography.bold, fontSize: 17 },
  body: { gap: spacing.lg, padding: spacing.lg },
  errorText: { backgroundColor: 'rgba(245, 247, 239, 0.1)', color: colors.text, fontFamily: typography.semibold, fontSize: 13, padding: spacing.sm },
  field: { gap: spacing.xs },
  input: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, color: colors.text, fontFamily: typography.body, fontSize: 15, minHeight: 48, paddingHorizontal: spacing.md },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs },
  chip: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center', minHeight: 40, paddingHorizontal: spacing.md },
  selectedChip: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.muted, fontFamily: typography.semibold, fontSize: 13 },
  selectedChipText: { color: colors.ink },
  footer: { borderTopColor: colors.line, borderTopWidth: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  saveButton: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, justifyContent: 'center', minHeight: 48 },
  saveButtonText: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  disabled: { opacity: 0.5 },
});
