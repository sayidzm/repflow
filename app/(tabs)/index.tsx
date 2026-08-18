import { Flame, ListChecks, Play, Plus, RefreshCw, Settings2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import type { Routine } from '@/domain/models/routine';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

export default function HomeScreen() {
  const { hasActiveWorkout, activeWorkout, startWorkout, startWorkoutFromRoutine } = useWorkoutDraft();
  const { routines } = useRoutines();

  const handleStartEmptyWorkout = async () => {
    if (!hasActiveWorkout) {
      await startWorkout();
    }
    router.push('/workout/active');
  };

  const handleStartRoutine = async (routine: Routine) => {
    await startWorkoutFromRoutine(routine);
    router.push('/workout/active');
  };

  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View>
            <View style={styles.brand}>
              <Flame color={colors.accent} fill={colors.accent} size={18} />
              <AppText style={styles.brandText}>REP</AppText>
            </View>
            <Label>TODAY</Label>
          </View>
          <IconButton accessibilityLabel="Settings">
            <Settings2 color={colors.text} size={18} />
          </IconButton>
        </View>

        <View style={styles.intro}>
          <AppText style={styles.headline}>
            {hasActiveWorkout ? `Workout in\nprogress.` : `Ready when\nyou are.`}
          </AppText>
          <AppText style={styles.subtitle}>
            {hasActiveWorkout
              ? `You have an active session (${activeWorkout?.name || 'Workout'}).`
              : 'Your training log, always on this device.'}
          </AppText>
        </View>

        {hasActiveWorkout ? (
          <Pressable accessibilityRole="button" onPress={() => router.push('/workout/active')} style={styles.resume}>
            <View>
              <AppText style={styles.startTitle}>Resume Workout</AppText>
              <AppText style={styles.resumeSubtitle}>{activeWorkout?.name || 'Active session in progress'}</AppText>
            </View>
            <View style={styles.play}>
              <RefreshCw color={colors.ink} size={17} />
            </View>
          </Pressable>
        ) : (
          <Pressable accessibilityRole="button" onPress={handleStartEmptyWorkout} style={styles.start}>
            <View>
              <AppText style={styles.startTitle}>Start Workout</AppText>
              <AppText style={styles.startSubtitle}>Log a session from scratch</AppText>
            </View>
            <View style={styles.play}>
              <Play color={colors.ink} fill={colors.ink} size={17} />
            </View>
          </Pressable>
        )}

        <Label style={styles.sectionLabel}>QUICK START</Label>
        <View style={styles.quickRow}>
          <Pressable accessibilityRole="button" onPress={handleStartEmptyWorkout} style={styles.quick}>
            <Plus color={colors.accent} size={18} />
            <AppText style={styles.quickText}>{hasActiveWorkout ? `Resume\nWorkout` : `Empty\nWorkout`}</AppText>
          </Pressable>
          <Pressable accessibilityRole="button" onPress={() => router.push('/routines')} style={styles.quick}>
            <ListChecks color={colors.accent} size={18} />
            <AppText style={styles.quickText}>Select{`\n`}Routine</AppText>
          </Pressable>
        </View>

        <View style={styles.routinesHeading}>
          <Label>YOUR ROUTINES</Label>
          <Pressable accessibilityRole="button" onPress={() => router.push('/routines')}>
            <AppText style={styles.link}>See all</AppText>
          </Pressable>
        </View>

        {routines.length === 0 ? (
          <View style={styles.emptyRoutines}>
            <AppText style={styles.emptyRoutinesText}>No routines created yet.</AppText>
          </View>
        ) : (
          routines.map((routine) => (
            <Pressable
              accessibilityLabel={`Open ${routine.name}`}
              accessibilityRole="button"
              key={routine.id}
              onPress={() => handleStartRoutine(routine)}
              style={styles.routineRow}
            >
              <View style={styles.bullet} />
              <View style={styles.routineCopy}>
                <AppText style={styles.routineName}>{routine.name}</AppText>
                <AppText style={styles.routineMeta}>
                  {routine.exercises.length} exercises · Last {routine.lastPerformed || 'Never'}
                </AppText>
              </View>
            </Pressable>
          ))
        )}
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
  resume: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.lg, flexDirection: 'row', justifyContent: 'space-between', minHeight: 86, paddingHorizontal: spacing.lg },
  startTitle: { color: colors.ink, fontFamily: typography.bold, fontSize: 18 },
  startSubtitle: { color: 'rgba(18,20,19,0.68)', fontFamily: typography.regular, fontSize: 11, marginTop: 4 },
  resumeSubtitle: { color: 'rgba(18,20,19,0.75)', fontFamily: typography.bold, fontSize: 11, marginTop: 4 },
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
  emptyRoutines: { paddingVertical: spacing.md },
  emptyRoutinesText: { color: colors.muted, fontFamily: typography.regular, fontSize: 13 },
});
