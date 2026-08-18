import { Flame, ListChecks, Play, Plus, Settings2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { referenceRoutines } from '@/features/routines/data/referenceRoutines';
import { colors, radius, spacing, typography } from '@/theme';

export default function HomeScreen() {
  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <View style={styles.brand}><Flame color={colors.accent} fill={colors.accent} size={18} /><AppText style={styles.brandText}>REP</AppText></View>
            <Label>MONDAY, AUG 18</Label>
          </View>
          <IconButton accessibilityLabel="Settings"><Settings2 color={colors.text} size={18} /></IconButton>
        </View>
        <View style={styles.intro}>
          <AppText style={styles.headline}>Ready when{`\n`}you are.</AppText>
          <AppText style={styles.subtitle}>Your training log, always on this device.</AppText>
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.push('/workout/active')} style={styles.start}>
          <View>
            <AppText style={styles.startTitle}>Start Workout</AppText>
            <AppText style={styles.startSubtitle}>Log a session from scratch</AppText>
          </View>
          <View style={styles.play}><Play color={colors.ink} fill={colors.ink} size={17} /></View>
        </Pressable>
        <Label style={styles.sectionLabel}>QUICK START</Label>
        <View style={styles.quickRow}>
          <Pressable accessibilityRole="button" onPress={() => router.push('/workout/active')} style={styles.quick}><Plus color={colors.accent} size={18} /><AppText style={styles.quickText}>Empty{`\n`}Workout</AppText></Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/routines')} style={styles.quick}><ListChecks color={colors.accent} size={18} /><AppText style={styles.quickText}>Select{`\n`}Routine</AppText></Pressable>
        </View>
        <View style={styles.routinesHeading}><Label>YOUR ROUTINES</Label><Pressable accessibilityRole="button" onPress={() => router.push('/routines')}><AppText style={styles.link}>See all</AppText></Pressable></View>
        {referenceRoutines.map((routine) => (
          <Pressable accessibilityLabel={`Open ${routine.name}`} accessibilityRole="button" key={routine.id} onPress={() => router.push('/routines')} style={styles.routineRow}>
            <View style={styles.bullet} />
            <View style={styles.routineCopy}><AppText style={styles.routineName}>{routine.name}</AppText><AppText style={styles.routineMeta}>{routine.exercises.length + 2} exercises · Last {routine.last}</AppText></View>
          </Pressable>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { paddingBottom: spacing.xl, paddingHorizontal: spacing.lg },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm },
  brand: { alignItems: 'center', flexDirection: 'row', gap: 5, marginBottom: 5 },
  brandText: { fontFamily: typography.extraBold, fontSize: 18, letterSpacing: -1 },
  intro: { paddingVertical: 42 },
  headline: { fontFamily: typography.extraBold, fontSize: 43, letterSpacing: -2.6, lineHeight: 43 },
  subtitle: { color: colors.muted, fontFamily: typography.regular, fontSize: 13, marginTop: spacing.md },
  start: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.lg, flexDirection: 'row', justifyContent: 'space-between', minHeight: 86, paddingHorizontal: spacing.lg },
  startTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18 },
  startSubtitle: { color: 'rgba(18,20,19,0.68)', fontFamily: typography.regular, fontSize: 11, marginTop: 4 },
  play: { alignItems: 'center', backgroundColor: 'rgba(18,20,19,0.12)', borderRadius: 23, height: 46, justifyContent: 'center', width: 46 },
  sectionLabel: { marginTop: spacing.xl },
  quickRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm },
  quick: { alignItems: 'flex-start', backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.md, borderWidth: 1, flex: 1, gap: spacing.sm, minHeight: 96, padding: spacing.md },
  quickText: { fontFamily: typography.semibold, fontSize: 13, lineHeight: 16 },
  routinesHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.xl },
  link: { color: colors.accent, fontFamily: typography.semibold, fontSize: 12, minHeight: 44, paddingTop: 13 },
  routineRow: { alignItems: 'center', borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', minHeight: 64 },
  bullet: { backgroundColor: colors.accent, borderRadius: 3, height: 6, marginRight: spacing.sm, width: 6 },
  routineCopy: { flex: 1 },
  routineName: { fontFamily: typography.bold, fontSize: 14 },
  routineMeta: { color: colors.muted, fontFamily: typography.regular, fontSize: 10, marginTop: 3 },
});
