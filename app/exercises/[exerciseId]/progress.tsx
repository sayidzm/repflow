import { ArrowLeft, Ellipsis } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { referenceExercises } from '@/features/exercises/data/referenceExercises';
import { colors, radius, spacing, typography } from '@/theme';

const history = [
  { date: 'Aug 18', sets: ['62.5 kg × 8', '62.5 kg × 8', '62.5 kg × 7'] },
  { date: 'Aug 15', sets: ['60 kg × 8', '60 kg × 8', '60 kg × 7'] },
  { date: 'Aug 11', sets: ['57.5 kg × 10', '57.5 kg × 9', '57.5 kg × 8'] },
];

export default function ExerciseProgressScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const exercise = referenceExercises.find((item) => item.id === exerciseId) ?? referenceExercises[0];
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><IconButton accessibilityLabel="Back" onPress={() => router.back()}><ArrowLeft color={colors.text} size={19} /></IconButton><AppText style={styles.brand}>REP</AppText><IconButton accessibilityLabel="Exercise options"><Ellipsis color={colors.text} size={19} /></IconButton></View>
        <View style={styles.titleBlock}><Label>EXERCISE DETAIL</Label><AppText style={styles.title}>{exercise.name}</AppText><AppText style={styles.meta}>{exercise.muscleGroup} · {exercise.category}</AppText></View>
        <View style={styles.summary}><View style={styles.summaryCell}><Label>LATEST</Label><AppText style={styles.metric}>62.5 <AppText style={styles.unit}>kg × 8</AppText></AppText></View><View style={styles.summaryCell}><Label>HEAVIEST SET</Label><AppText style={styles.metric}>65 <AppText style={styles.unit}>kg</AppText></AppText></View></View>
        <Label style={styles.historyLabel}>HISTORY</Label>
        {history.map((session) => <View key={session.date} style={styles.entry}><AppText style={styles.date}>{session.date}</AppText><View style={styles.sets}>{session.sets.map((set, index) => <AppText key={`${session.date}-${index}`} style={styles.set}>{set}</AppText>)}</View></View>)}
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontFamily: typography.extraBold, fontSize: 15, letterSpacing: -1 },
  titleBlock: { paddingVertical: 36 },
  title: { fontFamily: typography.extraBold, fontSize: 36, letterSpacing: -1.7, marginTop: spacing.xs },
  meta: { color: colors.muted, fontFamily: typography.regular, fontSize: 13, marginTop: spacing.xs },
  summary: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.lg, borderWidth: 1, flexDirection: 'row' },
  summaryCell: { flex: 1, padding: spacing.md },
  metric: { fontFamily: typography.extraBold, fontSize: 25, letterSpacing: -1, marginTop: spacing.sm },
  unit: { color: colors.muted, fontFamily: typography.semibold, fontSize: 11 },
  historyLabel: { marginTop: spacing.xl },
  entry: { borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', paddingVertical: spacing.md },
  date: { fontFamily: typography.mono, fontSize: 11, width: 72 },
  sets: { flex: 1, gap: spacing.xs },
  set: { color: colors.muted, fontFamily: typography.mono, fontSize: 12 },
});
