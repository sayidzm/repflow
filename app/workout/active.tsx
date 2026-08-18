import { Ellipsis, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Screen } from '@/components/ui/Screen';
import { ExerciseCard } from '@/features/workouts/components/ExerciseCard';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

export default function ActiveWorkoutScreen() {
  const insets = useSafeAreaInsets();
  const { exercises, addSet, toggleSet, updateSet } = useWorkoutDraft();

  return (
    <Screen bottomInset={false}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Close workout" onPress={() => router.back()}><X color={colors.text} size={19} /></IconButton>
          <View style={styles.headerCopy}><AppText style={styles.title}>Push Day</AppText><AppText style={styles.timer}>42:18 <AppText style={styles.exerciseCount}>· {exercises.length} exercises</AppText></AppText></View>
          <IconButton accessibilityLabel="Workout options"><Ellipsis color={colors.text} size={19} /></IconButton>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: 112 + insets.bottom }]} keyboardShouldPersistTaps="handled">
          {exercises.map((exercise) => (
            <ExerciseCard
              exercise={exercise}
              key={exercise.id}
              onAddSet={() => addSet(exercise.id)}
              onChangeSet={(setId, field, value) => updateSet(exercise.id, setId, field, value)}
              onToggleSet={(setId) => toggleSet(exercise.id, setId)}
            />
          ))}
        </ScrollView>
        <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/exercises/select')} style={styles.addExercise}><Plus color={colors.text} size={17} /><AppText style={styles.addText}>Add Exercise</AppText></Pressable>
          <Pressable accessibilityRole="button" disabled style={styles.finish}><AppText style={styles.finishText}>Finish Workout</AppText></Pressable>
        </View>
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
  finish: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, flex: 1, justifyContent: 'center', minHeight: 52, opacity: 0.55 },
  finishText: { color: colors.ink, fontFamily: typography.bold, fontSize: 12 },
});
