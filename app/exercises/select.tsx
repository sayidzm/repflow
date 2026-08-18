import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { ExercisePickerRow } from '@/features/exercises/components/ExercisePickerRow';
import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { MuscleGroupFilters, type MuscleFilter } from '@/features/exercises/components/MuscleGroupFilters';
import { referenceExercises } from '@/features/exercises/data/referenceExercises';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

export default function ExerciseSelectorScreen() {
  const insets = useSafeAreaInsets();
  const { addExercise, exercises: workoutExercises } = useWorkoutDraft();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleFilter>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const exercises = referenceExercises.filter((exercise) => {
    const matchesQuery = exercise.name.toLowerCase().includes(deferredQuery);
    return matchesQuery && (filter === 'All' || exercise.muscleGroup === filter);
  });
  const existingIds = new Set(workoutExercises.map((exercise) => exercise.id));

  function toggle(id: string) {
    if (existingIds.has(id)) return;
    setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function confirmSelection() {
    selectedIds.forEach((id) => {
      const exercise = referenceExercises.find((item) => item.id === id);
      if (exercise) addExercise(exercise);
    });
    router.back();
  }

  return (
    <Screen bottomInset={false}>
      <View style={styles.header}><IconButton accessibilityLabel="Back" onPress={() => router.back()}><ArrowLeft color={colors.text} size={19} /></IconButton><AppText style={styles.title}>Add Exercise</AppText><View style={styles.spacer} /></View>
      <FlatList
        ListEmptyComponent={<EmptyState message="Try another search or muscle group." title="No exercises found" />}
        ListHeaderComponent={<View style={styles.listHeader}><ExerciseSearchBar onChangeText={setQuery} value={query} /><MuscleGroupFilters onSelect={setFilter} selected={filter} /><Label>{filter} EXERCISES</Label></View>}
        contentContainerStyle={[styles.content, { paddingBottom: 92 + insets.bottom }]}
        data={exercises}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => <ExercisePickerRow exercise={item} onPress={() => toggle(item.id)} selected={selectedIds.includes(item.id) || existingIds.has(item.id)} />}
      />
      <View style={[styles.confirmBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <Pressable accessibilityRole="button" disabled={selectedIds.length === 0} onPress={confirmSelection} style={[styles.confirm, selectedIds.length === 0 && styles.disabled]}>
          <AppText style={styles.confirmText}>Add {selectedIds.length || ''} Exercise{selectedIds.length === 1 ? '' : 's'}</AppText>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = createStyles({
  header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', padding: spacing.md },
  title: { flex: 1, fontFamily: typography.bold, fontSize: 17, textAlign: 'center' },
  spacer: { width: 44 },
  content: { paddingHorizontal: spacing.lg },
  listHeader: { gap: spacing.md, paddingBottom: spacing.sm, paddingTop: spacing.md },
  confirmBar: { backgroundColor: colors.ink, borderTopColor: colors.line, borderTopWidth: 1, bottom: 0, left: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, position: 'absolute', right: 0 },
  confirm: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, justifyContent: 'center', minHeight: 52 },
  confirmText: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  disabled: { opacity: 0.45 },
});
