import { Settings2 } from 'lucide-react-native';
import { router } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { EmptyState } from '@/components/ui/EmptyState';
import { IconButton } from '@/components/ui/IconButton';
import { Label } from '@/components/ui/Label';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { HistoryWorkoutRow } from '@/features/history/components/HistoryWorkoutRow';
import { referenceHistory } from '@/features/history/data/referenceHistory';
import { colors, spacing } from '@/theme';

export default function HistoryScreen() {
  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          action={
            <IconButton accessibilityLabel="History settings">
              <Settings2 color={colors.text} size={18} />
            </IconButton>
          }
          label="TRAINING LOG"
          title="History"
        />
        {referenceHistory.length === 0 ? (
          <EmptyState message="Completed workouts will appear here." title="No workouts logged yet" />
        ) : (
          referenceHistory.map((group) => (
            <View key={group.date} style={styles.group}>
              <Label>{group.date}</Label>
              {group.workouts.map((workout) => (
                <HistoryWorkoutRow {...workout} key={workout.id} onPress={() => router.push(`/history/${workout.id}`)} />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  group: { marginTop: spacing.xl },
});
