import { ArrowLeft, Archive, Ellipsis } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { ActionSheetModal } from '@/components/ui/ActionSheetModal';
import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { useExercises } from '@/features/exercises/hooks/useExercises';
import { useProgress } from '@/features/progress/hooks/useProgress';
import { colors, radius, spacing, typography } from '@/theme';

export default function ExerciseProgressScreen() {
  const { exerciseId } = useLocalSearchParams<{ exerciseId: string }>();
  const { exercises, archiveExercise } = useExercises({ includeArchived: true });
  const { summary } = useProgress(exerciseId);
  const [optionsVisible, setOptionsVisible] = useState(false);

  const exercise = exercises.find((item) => item.id === exerciseId);

  if (!exercise) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <IconButton accessibilityLabel="Geri" onPress={() => router.back()}>
              <ArrowLeft color={colors.text} size={19} />
            </IconButton>
          </View>
          <EmptyState message="İstenen egzersiz bulunamadı." title="Egzersiz bulunamadı" />
        </ScrollView>
      </Screen>
    );
  }

  const latestStr = summary.latestSet
    ? `${summary.latestSet.weight} kg × ${summary.latestSet.reps}`
    : '- kg × -';

  const heaviestStr = summary.heaviestSet ? `${summary.heaviestSet.weight} kg` : '- kg';

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <IconButton accessibilityLabel="Geri" onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={19} />
          </IconButton>
          <AppText style={styles.brand}>REP</AppText>
          <IconButton accessibilityLabel="Egzersiz seçenekleri" onPress={() => setOptionsVisible(true)}>
            <Ellipsis color={colors.text} size={19} />
          </IconButton>
        </View>

        <View style={styles.titleBlock}>
          <Label>EGZERSİZ DETAYI</Label>
          <AppText style={styles.title}>{exercise.name}</AppText>
          <AppText style={styles.meta}>
            {exercise.muscleGroup} · {exercise.category}
          </AppText>
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryCell}>
            <Label>SON SET</Label>
            <AppText style={styles.metric}>{latestStr}</AppText>
          </View>
          <View style={styles.summaryCell}>
            <Label>EN AĞIR SET</Label>
            <AppText style={styles.metric}>{heaviestStr}</AppText>
          </View>
        </View>

        <Label style={styles.historyLabel}>GEÇMİŞ</Label>
        {summary.sessions.length === 0 ? (
          <EmptyState message="Geçmişinizi burada görmek için bu egzersizle antrenman kaydedin." title="Henüz geçmiş kaydedilmedi" />
        ) : (
          summary.sessions.map((session) => (
            <View key={session.workoutId} style={styles.entry}>
              <AppText style={styles.date}>{session.date}</AppText>
              <View style={styles.sets}>
                {session.sets.map((s, index) => (
                  <AppText key={s.id || `${session.workoutId}-${index}`} style={styles.set}>
                    {s.weight} kg × {s.reps}
                  </AppText>
                ))}
              </View>
            </View>
          ))
        )}

        <ActionSheetModal
          onClose={() => setOptionsVisible(false)}
          options={[
            {
              label: 'Egzersizi Arşivle',
              icon: <Archive color="#ef4444" size={18} />,
              style: 'destructive',
              onPress: async () => {
                try {
                  await archiveExercise(exercise.id);
                } catch {
                  // handle errors silently
                }
                router.back();
              },
            },
          ]}
          title={exercise.name}
          visible={optionsVisible}
        />
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
  metric: { fontFamily: typography.extraBold, fontSize: 20, letterSpacing: -0.8, marginTop: spacing.xs },
  historyLabel: { marginTop: spacing.xl },
  entry: { borderBottomColor: colors.line, borderBottomWidth: 1, flexDirection: 'row', paddingVertical: spacing.md },
  date: { fontFamily: typography.mono, fontSize: 11, width: 72 },
  sets: { flex: 1, gap: spacing.xs },
  set: { color: colors.muted, fontFamily: typography.mono, fontSize: 12 },
});
