import { ArrowLeft, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { CreateExerciseModal } from '@/features/exercises/components/CreateExerciseModal';
import { ExercisePickerRow } from '@/features/exercises/components/ExercisePickerRow';
import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { MuscleGroupFilters, type MuscleFilter } from '@/features/exercises/components/MuscleGroupFilters';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

export default function ExerciseSelectorScreen() {
  const insets = useSafeAreaInsets();
  const { addExercise, exercises: workoutExercises } = useWorkoutDraft();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleFilter>('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const { exercises, createCustomExercise } = useExercises({
    muscleGroup: filter,
    searchQuery: deferredQuery,
  });

  const existingIds = new Set(workoutExercises.map((exercise) => exercise.id));

  function toggle(id: string) {
    if (existingIds.has(id)) return;
    setSelectedIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  function confirmSelection() {
    selectedIds.forEach((id) => {
      const exercise = exercises.find((item) => item.id === id);
      if (exercise) addExercise(exercise);
    });
    router.back();
  }

  return (
    <Screen bottomInset={false}>
      <View style={styles.header}>
        <IconButton accessibilityLabel="Geri" onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={19} />
        </IconButton>
        <AppText style={styles.title}>Egzersiz Ekle</AppText>
        <Pressable
          accessibilityLabel="Özel egzersiz oluştur"
          accessibilityRole="button"
          onPress={() => setCreateModalVisible(true)}
          style={styles.newButton}
        >
          <Plus color={colors.accent} size={16} />
          <AppText style={styles.newButtonText}>Özel</AppText>
        </Pressable>
      </View>

      <FlatList
        ListEmptyComponent={<EmptyState message="Farklı bir arama deneyin veya özel egzersiz oluşturun." title="Egzersiz bulunamadı" />}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <ExerciseSearchBar onChangeText={setQuery} value={query} />
            <MuscleGroupFilters onSelect={setFilter} selected={filter} />
            <Label>{filter === 'All' ? 'TÜM' : filter.toUpperCase()} EGZERSİZLER</Label>
          </View>
        }
        contentContainerStyle={[styles.content, { paddingBottom: 92 + insets.bottom }]}
        data={exercises}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <ExercisePickerRow
            exercise={item}
            onPress={() => toggle(item.id)}
            selected={selectedIds.includes(item.id) || existingIds.has(item.id)}
          />
        )}
      />

      <View style={[styles.confirmBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <Pressable
          accessibilityRole="button"
          disabled={selectedIds.length === 0}
          onPress={confirmSelection}
          style={[styles.confirm, selectedIds.length === 0 && styles.disabled]}
        >
          <AppText style={styles.confirmText}>
            {selectedIds.length ? `${selectedIds.length} Egzersiz Ekle` : 'Egzersiz Ekle'}
          </AppText>
        </Pressable>
      </View>

      <CreateExerciseModal
        onClose={() => setCreateModalVisible(false)}
        onSubmit={async (data) => {
          const newEx = await createCustomExercise(data);
          setSelectedIds((prev) => [...prev, newEx.id]);
        }}
        visible={createModalVisible}
      />
    </Screen>
  );
}

const styles = createStyles({
  header: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', padding: spacing.md },
  title: { flex: 1, fontFamily: typography.bold, fontSize: 17, textAlign: 'center' },
  newButton: { alignItems: 'center', flexDirection: 'row', gap: 4, paddingHorizontal: spacing.xs, paddingVertical: spacing.xs },
  newButtonText: { color: colors.accent, fontFamily: typography.semibold, fontSize: 13 },
  content: { paddingHorizontal: spacing.lg },
  listHeader: { gap: spacing.md, paddingBottom: spacing.sm, paddingTop: spacing.md },
  confirmBar: { backgroundColor: colors.ink, borderTopColor: colors.line, borderTopWidth: 1, bottom: 0, left: 0, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, position: 'absolute', right: 0 },
  confirm: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.md, justifyContent: 'center', minHeight: 52 },
  confirmText: { color: colors.ink, fontFamily: typography.bold, fontSize: 14 },
  disabled: { opacity: 0.45 },
});
