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
import { useHistory } from '@/features/history/hooks/useHistory';
import { colors, spacing } from '@/theme';

export default function HistoryScreen() {
  const { groups } = useHistory();

  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          action={
            <IconButton accessibilityLabel="Geçmiş ayarları">
              <Settings2 color={colors.text} size={18} />
            </IconButton>
          }
          label="ANTRENMAN KAYDI"
          title="Geçmiş"
        />
        {groups.length === 0 ? (
          <EmptyState message="Tamamlanan antrenmanlar burada görünecektir." title="Henüz antrenman kaydedilmedi" />
        ) : (
          groups.map((group) => (
            <View key={group.date} style={styles.group}>
              <Label>{group.date}</Label>
              {group.workouts.map((workout) => (
                <HistoryWorkoutRow
                  detail={workout.detail}
                  duration={workout.duration}
                  key={workout.id}
                  name={workout.name}
                  onPress={() => router.push(`/history/${workout.id}`)}
                />
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
