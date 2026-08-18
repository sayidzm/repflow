import { ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { useDeferredValue, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { ExerciseSearchBar } from '@/features/exercises/components/ExerciseSearchBar';
import { referenceExercises } from '@/features/exercises/data/referenceExercises';
import { colors, spacing, typography } from '@/theme';

export default function ExercisesScreen() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const exercises = referenceExercises.filter((exercise) => exercise.name.toLowerCase().includes(deferredQuery));

  return (
    <Screen bottomInset={false}>
      <FlatList
        ListEmptyComponent={<EmptyState message="Try another exercise name." title="No exercises found" />}
        ListHeaderComponent={<View style={styles.header}><SectionHeader label="EXERCISE LIBRARY" title="Exercises" /><ExerciseSearchBar onChangeText={setQuery} value={query} /></View>}
        contentContainerStyle={styles.content}
        data={exercises}
        keyExtractor={(item) => item.id}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <Pressable accessibilityRole="button" onPress={() => router.push(`/exercises/${item.id}/progress`)} style={styles.row}>
            <View style={styles.copy}><AppText style={styles.name}>{item.name}</AppText><AppText style={styles.meta}>{item.muscleGroup} · {item.category}</AppText></View>
            <ChevronRight color={colors.muted} size={18} />
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  header: { gap: spacing.lg, marginBottom: spacing.sm },
  row: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72 },
  copy: { flex: 1 },
  name: { fontFamily: typography.bold, fontSize: 15 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 11, marginTop: 3 },
});
