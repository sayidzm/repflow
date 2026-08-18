import { Ellipsis, Plus, Trash2, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
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

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { exercises, addSet, toggleSet, updateSet, clearDraft } = useWorkoutDraft();
  const [optionsVisible, setOptionsVisible] = useState(false);

  return (
    <Screen bottomInset={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Close workout" onPress={() => router.back()}>
            <X color={colors.text} size={19} />
          </IconButton>
          <View style={styles.headerCopy}>
            <AppText style={styles.title}>Active Workout</AppText>
            <AppText style={styles.timer}>
              00:00 <AppText style={styles.exerciseCount}>· {exercises.length} exercises</AppText>
            </AppText>
          </View>
          <IconButton accessibilityLabel="Workout options" onPress={() => setOptionsVisible(true)}>
            <Ellipsis color={colors.text} size={19} />
          </IconButton>
        </View>

        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 112 + insets.bottom }]} keyboardShouldPersistTaps="handled">
          {exercises.length === 0 ? (
            <EmptyState message="Tap 'Add Exercise' below to add movements to your workout." title="No exercises added" />
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
            <AppText style={styles.addText}>Add Exercise</AppText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            disabled={exercises.length === 0}
            onPress={() => {
              clearDraft();
              router.back();
            }}
            style={[styles.finish, exercises.length === 0 && styles.finishDisabled]}
          >
            <AppText style={styles.finishText}>Finish Workout</AppText>
          </Pressable>
        </View>

        <ActionSheetModal
          onClose={() => setOptionsVisible(false)}
          options={[
            {
              label: 'Add Exercise',
              icon: <Plus color={colors.text} size={18} />,
              onPress: () => router.push('/exercises/select'),
            },
            {
              label: 'Discard Workout',
              icon: <Trash2 color="#ef4444" size={18} />,
              style: 'destructive',
              onPress: () => {
                clearDraft();
                router.back();
              },
            },
          ]}
          title="Workout Options"
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
