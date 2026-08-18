import { ArrowLeft, Dumbbell } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import type { Workout } from '@/domain/models/workout';
import { formatDuration } from '@/database/repositories/HistoryRepository';
import { useHistory } from '@/features/history/hooks/useHistory';
import { colors, radius, spacing, typography } from '@/theme';

function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString('tr-TR', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

export default function WorkoutDetailScreen() {
  const { workoutId } = useLocalSearchParams<{ workoutId: string }>();
  const { getWorkoutDetail } = useHistory();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (workoutId) {
      getWorkoutDetail(workoutId).then((data) => {
        if (isMounted) {
          setWorkout(data);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [workoutId, getWorkoutDetail]);

  if (loading) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <IconButton accessibilityLabel="Back" onPress={() => router.back()}>
              <ArrowLeft color={colors.text} size={19} />
            </IconButton>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  if (!workout) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <IconButton accessibilityLabel="Geri" onPress={() => router.back()}>
              <ArrowLeft color={colors.text} size={19} />
            </IconButton>
          </View>
          <EmptyState message="İstenen antrenman bulunamadı." title="Antrenman bulunamadı" />
        </ScrollView>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Geri" onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={19} />
          </IconButton>
          <Label>ANTRENMAN DETAYI</Label>
          <View style={styles.spacer} />
        </View>

        <AppText style={styles.title}>{workout.name}</AppText>
        <AppText style={styles.meta}>
          {formatDate(workout.startedAt)} · {formatDuration(workout.durationSeconds)}
        </AppText>

        {workout.exercises.map((ex) => (
          <View key={ex.id} style={styles.card}>
            <View style={styles.exerciseHeader}>
              <Dumbbell color={colors.accent} size={19} />
              <AppText style={styles.exerciseTitle}>{ex.exerciseNameSnapshot}</AppText>
            </View>
            {ex.sets.map((set, index) => {
              const weightStr = set.weight !== null ? `${set.weight} kg` : '- kg';
              const repsStr = set.reps !== null ? `${set.reps}` : '-';
              return (
                <View key={set.id} style={styles.setRow}>
                  <AppText style={styles.setNumber}>{index + 1}</AppText>
                  <AppText style={styles.setValue}>
                    {weightStr} × {repsStr} {set.isCompleted ? '' : '(Tamamlanmadı)'}
                  </AppText>
                </View>
              );
            })}
          </View>
        ))}
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
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
