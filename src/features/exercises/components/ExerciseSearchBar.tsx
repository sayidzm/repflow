import { Search } from 'lucide-react-native';
import { TextInput, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { colors, radius, spacing, typography } from '@/theme';

export function ExerciseSearchBar({ value, onChangeText }: { value: string; onChangeText: (value: string) => void }) {
  return (
    <View style={styles.container}>
      <Search color={colors.muted} size={18} strokeWidth={1.8} />
      <TextInput
        accessibilityLabel="Search exercises"
        autoCapitalize="none"
        onChangeText={onChangeText}
        placeholder="Search exercises"
        placeholderTextColor={colors.muted}
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
    </View>
  );
}

const styles = createStyles({
  container: { alignItems: 'center', backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, flexDirection: 'row', gap: spacing.sm, minHeight: 50, paddingHorizontal: spacing.md },
  input: { color: colors.text, flex: 1, fontFamily: typography.body, fontSize: 15, paddingVertical: 0 },
});
