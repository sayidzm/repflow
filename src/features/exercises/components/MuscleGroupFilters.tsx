import { ScrollView, Pressable } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import type { MuscleGroup } from '@/domain/models';
import { colors, radius, spacing, typography } from '@/theme';

export type MuscleFilter = 'All' | MuscleGroup;

const filters: MuscleFilter[] = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core'];

export function MuscleGroupFilters({ selected, onSelect }: { selected: MuscleFilter; onSelect: (filter: MuscleFilter) => void }) {
  return (
    <ScrollView contentContainerStyle={styles.content} horizontal showsHorizontalScrollIndicator={false}>
      {filters.map((filter) => {
        const isSelected = selected === filter;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isSelected }}
            key={filter}
            onPress={() => onSelect(filter)}
            style={[styles.chip, isSelected && styles.selected]}
          >
            <AppText style={[styles.text, isSelected && styles.selectedText]}>{filter}</AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = createStyles({
  content: { gap: spacing.sm, paddingRight: spacing.lg },
  chip: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.pill, borderWidth: 1, justifyContent: 'center', minHeight: 44, paddingHorizontal: spacing.md },
  selected: { backgroundColor: colors.accent, borderColor: colors.accent },
  text: { color: colors.muted, fontFamily: typography.semibold, fontSize: 13 },
  selectedText: { color: colors.ink },
});
