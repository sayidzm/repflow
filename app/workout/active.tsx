import { Ellipsis, Plus, Trash2, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { ActionSheetModal } from '@/components/ui/ActionSheetModal';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { ExerciseCard } from '@/features/workouts/components/ExerciseCard';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

function formatElapsedTime(startedAt?: number): string {
  if (!startedAt) return '00:00';
  const elapsedSeconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
  const hrs = Math.floor(elapsedSeconds / 3600);
  const mins = Math.floor((elapsedSeconds % 3600) / 60);
  const secs = elapsedSeconds % 60;

  const pad = (n: number) => String(n).padStart(2, '0');
  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { activeWorkout, exercises, addSet, toggleSet, updateSet, discardWorkout, finishWorkout, startWorkout } = useWorkoutDraft();
  const [optionsVisible, setOptionsVisible] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(() => formatElapsedTime(activeWorkout?.startedAt));

  // Auto-start workout if not started yet
  useEffect(() => {
    if (!activeWorkout) {
      startWorkout();
    }
  }, [activeWorkout, startWorkout]);

  // Timer tick
  useEffect(() => {
    if (!activeWorkout?.startedAt) return;

    const interval = setInterval(() => {
      setElapsedTime(formatElapsedTime(activeWorkout.startedAt));
    }, 1000);

    return () => clearInterval(interval);
  }, [activeWorkout?.startedAt]);

  const handleFinish = async () => {
    if (exercises.length === 0) return;
    await finishWorkout();
    router.back();
  };

  const handleDiscard = async () => {
    await discardWorkout();
    router.back();
  };

  return (
    <Screen bottomInset={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Antrenmanı kapat" onPress={() => router.back()}>
            <X color={colors.text} size={19} />
          </IconButton>
          <View style={styles.headerCopy}>
            <AppText style={styles.title}>{activeWorkout?.name || 'Aktif Antrenman'}</AppText>
            <AppText style={styles.timer}>
              {elapsedTime} <AppText style={styles.exerciseCount}>· {exercises.length} egzersiz</AppText>
            </AppText>
          </View>
          <IconButton accessibilityLabel="Antrenman seçenekleri" onPress={() => setOptionsVisible(true)}>
            <Ellipsis color={colors.text} size={19} />
          </IconButton>
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 112 + insets.bottom }]} keyboardShouldPersistTaps="handled">
          {exercises.length === 0 ? (
            <EmptyState message="Antrenmanına hareket eklemek için aşağıdaki 'Egzersiz Ekle' butonuna dokun." title="Henüz egzersiz eklenmedi" />
          ) : (
            exercises.map((exercise) => (
              <ExerciseCard
                exercise={exercise}
                key={exercise.id}
                onAddSet={() => addSet(exercise.id)}
                onChangeSet={(setId, field, value) => updateSet(exercise.id, setId, field, value)}
                onToggleSet={(setId) => toggleSet(exercise.id, setId)}
              />
            ))
          )}
        </ScrollView>

        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/exercises/select')} style={styles.addExercise}>
            <Plus color={colors.text} size={17} />
            <AppText style={styles.addText}>Egzersiz Ekle</AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={exercises.length === 0}
            onPress={handleFinish}
            style={[styles.finish, exercises.length === 0 && styles.finishDisabled]}
          >
            <AppText style={styles.finishText}>Antrenmanı Bitir</AppText>
          </Pressable>
        </View>

        <ActionSheetModal
          onClose={() => setOptionsVisible(false)}
          options={[
            {
              label: 'Egzersiz Ekle',
              icon: <Plus color={colors.text} size={18} />,
              onPress: () => router.push('/exercises/select'),
            },
            {
              label: 'Antrenmanı İptal Et',
              icon: <Trash2 color="#ef4444" size={18} />,
              style: 'destructive',
              onPress: handleDiscard,
            },
          ]}
          title="Antrenman Seçenekleri"
          visible={optionsVisible}
        />
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = createStyles({
  flex: { flex: 1 },
  header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', padding: spacing.md },
  headerCopy: { alignItems: 'center', flex: 1 },
  title: { fontFamily: typography.bold, fontSize: 17 },
  timer: { color: colors.accent, fontFamily: typography.mono, fontSize: 11, marginTop: 4 },
  exerciseCount: { color: colors.muted, fontFamily: typography.regular },
  content: { gap: spacing.md, padding: spacing.md },
  actions: { backgroundColor: colors.ink, borderTopColor: colors.line, borderTopWidth: 1, bottom: 0, flexDirection: 'row', gap: spacing.sm, left: 0, paddingHorizontal: spacing.md, paddingTop: spacing.sm, position: 'absolute', right: 0 },
  addExercise: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, flex: 1, flexDirection: 'row', gap: spacing.xs, justifyContent: 'center', minHeight: 52 },
  addText: { fontFamily: typography.semibold, fontSize: 12 },
  finish: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, flex: 1, justifyContent: 'center', minHeight: 52 },
  finishDisabled: { opacity: 0.45 },
  finishText: { color: colors.ink, fontFamily: typography.bold, fontSize: 12 },
});
