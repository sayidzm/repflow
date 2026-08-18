import { Archive, Ellipsis, Eye, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { ActionSheetModal } from '@/components/ui/ActionSheetModal';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreateExerciseModal } from '@/features/exercises/components/CreateExerciseModal';
import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { MuscleGroupFilters, type MuscleFilter } from '@/features/exercises/components/MuscleGroupFilters';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import type { Exercise } from '@/domain/models';
import { colors, radius, spacing, typography } from '@/theme';

export default function ExercisesScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleFilter>('All');
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  const deferredQuery = useDeferredValue(query);
  const { exercises, createCustomExercise, archiveExercise } = useExercises({
    muscleGroup: filter,
    searchQuery: deferredQuery,
  });

  return (
    <Screen bottomInset={false}>
      <FlatList
        ListEmptyComponent={<EmptyState message="Try another search or create a custom exercise." title="No exercises found" />}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.topRow}>
              <SectionHeader label="EXERCISE LIBRARY" title="Exercises" />
              <Pressable
                accessibilityLabel="Create custom exercise"
                accessibilityRole="button"
                onPress={() => setCreateModalVisible(true)}
                style={styles.addButton}
              >
                <Plus color={colors.ink} size={16} />
                <AppText style={styles.addButtonText}>New</AppText>
              </Pressable>
            </View>
            <ExerciseSearchBar onChangeText={setQuery} value={query} />
            <MuscleGroupFilters onSelect={setFilter} selected={filter} />
          </View>
        }
        contentContainerStyle={styles.content}
        data={exercises}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push(`/exercises/${item.id}/progress`)}
              style={styles.copy}
            >
              <View style={styles.titleRow}>
                <AppText style={styles.name}>{item.name}</AppText>
                {item.isCustom ? (
                  <View style={styles.customBadge}>
                    <AppText style={styles.customBadgeText}>Custom</AppText>
                  </View>
                ) : null}
              </View>
              <AppText style={styles.meta}>
                {item.muscleGroup} · {item.category}
              </AppText>
            </Pressable>
            <Pressable
              accessibilityLabel={`${item.name} options`}
              accessibilityRole="button"
              hitSlop={10}
              onPress={() => setSelectedExercise(item)}
              style={styles.optionsButton}
            >
              <Ellipsis color={colors.muted} size={20} />
            </Pressable>
          </View>
        )}
      />

      <CreateExerciseModal
        onClose={() => setCreateModalVisible(false)}
        onSubmit={async (data) => {
          await createCustomExercise(data);
        }}
        visible={createModalVisible}
      />

      <ActionSheetModal
        description={selectedExercise ? `${selectedExercise.muscleGroup} · ${selectedExercise.category}` : undefined}
        onClose={() => setSelectedExercise(null)}
        options={
          selectedExercise
            ? [
                {
                  label: 'View Progress',
                  icon: <Eye color={colors.text} size={18} />,
                  onPress: () => router.push(`/exercises/${selectedExercise.id}/progress`),
                },
                {
                  label: 'Archive Exercise',
                  icon: <Archive color="#ef4444" size={18} />,
                  style: 'destructive',
                  onPress: async () => {
                    await archiveExercise(selectedExercise.id);
                  },
                },
              ]
            : []
        }
        title={selectedExercise?.name}
        visible={selectedExercise !== null}
      />
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { gap: spacing.md, marginBottom: spacing.md },
  topRow: { alignItems: 'flex-end', flexDirection: 'row', justifyContent: 'space-between' },
  addButton: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.pill, flexDirection: 'row', gap: 4, minHeight: 36, paddingHorizontal: spacing.md },
  addButtonText: { color: colors.ink, fontFamily: typography.bold, fontSize: 13 },
  row: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72 },
  copy: { flex: 1, paddingRight: spacing.sm, paddingVertical: spacing.sm },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  name: { fontFamily: typography.bold, fontSize: 15 },
  customBadge: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.sm, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  customBadgeText: { color: colors.accent, fontFamily: typography.semibold, fontSize: 10 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, marginTop: 4 },
  optionsButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
});
