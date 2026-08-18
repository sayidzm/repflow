import { ArrowLeft, Dumbbell } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { colors, radius, spacing, typography } from '@/theme';

export default function WorkoutDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const name = workoutId?.startsWith('pull') ? 'Pull Day' : workoutId?.startsWith('legs') ? 'Leg Day' : workoutId?.startsWith('mobility') ? 'Mobility' : 'Push Day';
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><IconButton accessibilityLabel="Back" onPress={() => router.back()}><ArrowLeft color={colors.text} size={19} /></IconButton><Label>WORKOUT DETAIL</Label><View style={styles.spacer} /></View>
        <AppText style={styles.title}>{name}</AppText><AppText style={styles.meta}>Monday, Aug 18 · 54 min</AppText>
        <View style={styles.card}><View style={styles.exerciseHeader}><Dumbbell color={colors.accent} size={19} /><AppText style={styles.exerciseTitle}>Bench Press</AppText></View>{['62.5 kg × 8', '62.5 kg × 8', '62.5 kg × 7'].map((set, index) => <View key={set + index} style={styles.setRow}><AppText style={styles.setNumber}>{index + 1}</AppText><AppText style={styles.setValue}>{set}</AppText></View>)}</View>
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  spacer: { width: 44 },
  title: { fontFamily: typography.extraBold, fontSize: 36, letterSpacing: -1.8, marginTop: 36 },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, marginTop: spacing.xs },
  card: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.lg, borderWidth: 1, marginTop: spacing.xl, padding: spacing.md },
  exerciseHeader: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', gap: spacing.sm, paddingBottom: spacing.md },
  exerciseTitle: { fontFamily: typography.bold, fontSize: 18 },
  setRow: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 52 },
  setNumber: { color: colors.muted, fontFamily: typography.mono, width: 42 },
  setValue: { fontFamily: typography.mono, fontSize: 13 },
});
