import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { RoutineCard } from '@/features/routines/components/RoutineCard';
import { referenceRoutines } from '@/features/routines/data/referenceRoutines';
import { colors, radius, spacing, typography } from '@/theme';

export default function RoutinesScreen() {
  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          action={
            <Pressable accessibilityRole="button" disabled style={styles.newButton}>
              <Plus color={colors.muted} size={16} />
              <AppText style={styles.newText}>New</AppText>
            </Pressable>
          }
          label="YOUR LIBRARY"
          title="Routines"
        />
        {referenceRoutines.map((routine) => <RoutineCard {...routine} key={routine.id} onStart={() => router.push('/workout/active')} />)}
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.xl },
  newButton: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, minHeight: 44, opacity: 0.55, paddingHorizontal: spacing.md },
  newText: { color: colors.muted, fontFamily: typography.semibold, fontSize: 12 },
});
