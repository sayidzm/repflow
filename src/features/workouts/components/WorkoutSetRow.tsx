import { Check } from 'lucide-react-native';
import { Pressable, TextInput, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import type { WorkoutSet } from '@/domain/models';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  index: number;
  set: WorkoutSet;
  onChange: (field: 'weight' | 'reps', value: string) => void;
  onToggle: () => void;
};

export function WorkoutSetRow({ index, set, onChange, onToggle }: Props) {
  return (
    <View style={[styles.row, set.isCompleted && styles.doneRow]}>
      <AppText style={styles.number}>{index + 1}</AppText>
      <AppText style={styles.previous}>60 × {index === 2 ? 7 : 8}</AppText>
      <TextInput
        accessibilityLabel={`Set ${index + 1} kilograms`}
        keyboardType="decimal-pad"
        onChangeText={(value) => onChange('weight', value)}
        selectTextOnFocus
        style={styles.input}
        value={set.weight}
      />
      <TextInput
        accessibilityLabel={`Set ${index + 1} reps`}
        keyboardType="number-pad"
        onChangeText={(value) => onChange('reps', value.replace(/[^0-9]/g, ''))}
        selectTextOnFocus
        style={styles.input}
        value={set.reps}
      />
      <Pressable
        accessibilityLabel={`${set.isCompleted ? 'Mark incomplete' : 'Complete'} set ${index + 1}`}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: set.isCompleted }}
        hitSlop={4}
        onPress={onToggle}
        style={[styles.check, set.isCompleted && styles.checkDone]}
      >
        {set.isCompleted && <Check color={colors.ink} size={18} strokeWidth={2.5} />}
      </Pressable>
    </View>
  );
}

const styles = createStyles({
  row: { alignItems: 'center', borderRadius: radius.sm, flexDirection: 'row', gap: spacing.xs, minHeight: 52, paddingHorizontal: 4 },
  doneRow: { backgroundColor: 'rgba(118,209,160,0.08)' },
  number: { fontFamily: typography.mono, fontSize: 12, textAlign: 'center', width: 20 },
  previous: { color: colors.muted, fontFamily: typography.mono, fontSize: 10, textAlign: 'center', width: 54 },
  input: { backgroundColor: colors.panelRaised, borderColor: colors.line, borderRadius: radius.sm, borderWidth: 1, color: colors.text, flex: 1, fontFamily: typography.mono, fontSize: 14, height: 44, maxWidth: 68, paddingHorizontal: 5, paddingVertical: 0, textAlign: 'center' },
  check: { alignItems: 'center', borderColor: colors.line, borderRadius: 22, borderWidth: 1, height: 44, justifyContent: 'center', width: 44 },
  checkDone: { backgroundColor: colors.success, borderColor: colors.success },
});
