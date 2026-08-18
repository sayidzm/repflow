import { ChevronRight, Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { CreateExerciseModal } from '@/features/exercises/components/CreateExerciseModal';
import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { MuscleGroupFilters, type MuscleFilter } from '@/features/exercises/components/MuscleGroupFilters';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { colors, radius, spacing, typography } from '@/theme';

export default function ExercisesScreen() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<MuscleFilter>('All');
  const [createModalVisible, setCreateModalVisible] = useState(false);

  const deferredQuery = useDeferredValue(query);
  const { exercises, createCustomExercise } = useExercises({
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
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push(`/exercises/${item.id}/progress`)}
            style={styles.row}
          >
            <View style={styles.copy}>
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
            </View>
            <ChevronRight color={colors.muted} size={18} />
          </Pressable>
        )}
      />

      <CreateExerciseModal
        onClose={() => setCreateModalVisible(false)}
        onSubmit={async (data) => {
          await createCustomExercise(data);
        }}
        visible={createModalVisible}
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
  copy: { flex: 1 },
  titleRow: { alignItems: 'center', flexDirection: 'row', gap: spacing.xs },
  name: { fontFamily: typography.bold, fontSize: 15 },
  customBadge: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.sm, borderWidth: 1, paddingHorizontal: 6, paddingVertical: 2 },
  customBadgeText: { color: colors.accent, fontFamily: typography.semibold, fontSize: 10 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, marginTop: 4 },
});
