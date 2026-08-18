import { Check, Plus } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import type { Exercise } from '@/domain/models';
import { colors, spacing, typography } from '@/theme';

export function ExercisePickerRow({ exercise, selected, onPress }: { exercise: Exercise; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={(state) => [styles.row, state.pressed && styles.pressed]}
    >
      <View style={styles.copy}>
        <AppText numberOfLines={2} style={styles.name}>{exercise.name}</AppText>
        <AppText style={styles.meta}>{exercise.muscleGroup} · {exercise.category}</AppText>
      </View>
      <View style={[styles.control, selected && styles.selected]}>
        {selected ? <Check color={colors.ink} size={18} strokeWidth={2.4} /> : <Plus color={colors.text} size={19} />}
      </View>
    </Pressable>
  );
}

const styles = createStyles({
  row: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 72, paddingVertical: spacing.sm },
  pressed: { opacity: 0.72 },
  copy: { flex: 1, paddingRight: spacing.md },
  name: { fontFamily: typography.bold, fontSize: 15 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, marginTop: 4 },
  control: { alignItems: 'center', borderColor: colors.line, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  selected: { backgroundColor: colors.accent, borderColor: colors.accent },
});
