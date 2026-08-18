import { Plus } from 'lucide-react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { EmptyState } from '@/components/ui/EmptyState';
import { Screen } from '@/components/ui/Screen';
import { SectionHeader } from '@/components/shared/SectionHeader';
import type { Routine } from '@/domain/models/routine';
import { CreateRoutineModal } from '@/features/routines/components/CreateRoutineModal';
import { RoutineCard } from '@/features/routines/components/RoutineCard';
import { useRoutines } from '@/features/routines/hooks/useRoutines';
import { useWorkoutDraft } from '@/providers/WorkoutDraftProvider';
import { colors, radius, spacing, typography } from '@/theme';

export default function RoutinesScreen() {
  const { routines, createRoutine, updateRoutine, deleteRoutine } = useRoutines();
  const { startWorkoutFromRoutine } = useWorkoutDraft();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);

  const handleOpenCreate = () => {
    setEditingRoutine(null);
    setModalVisible(true);
  };

  const handleOpenEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setModalVisible(true);
  };

  const handleStartRoutine = async (routine: Routine) => {
    await startWorkoutFromRoutine(routine);
    router.push('/workout/active');
  };

  const handleSubmitModal = async (input: { name: string; exerciseIds: string[] }) => {
    if (editingRoutine) {
      await updateRoutine(editingRoutine.id, input);
    } else {
      await createRoutine(input);
    }
  };

  return (
    <Screen bottomInset={false}>
      <ScrollView contentContainerStyle={styles.content}>
        <SectionHeader
          action={
            <Pressable accessibilityRole="button" onPress={handleOpenCreate} style={styles.newButton}>
              <Plus color={colors.text} size={16} />
              <AppText style={styles.newText}>New</AppText>
            </Pressable>
          }
          label="YOUR LIBRARY"
          title="Routines"
        />

        {routines.length === 0 ? (
          <View style={styles.emptyContainer}>
            <EmptyState message="Tap '+ New' above to build a routine." title="No routines created yet" />
          </View>
        ) : (
          routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              onDelete={() => deleteRoutine(routine.id)}
              onEdit={() => handleOpenEdit(routine)}
              onStart={() => handleStartRoutine(routine)}
              routine={routine}
            />
          ))
        )}

        <CreateRoutineModal
          initialRoutine={editingRoutine}
          onClose={() => setModalVisible(false)}
          onSubmit={handleSubmitModal}
          visible={modalVisible}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = createStyles({
  content: { gap: spacing.md, padding: spacing.lg, paddingBottom: spacing.xl },
  newButton: { alignItems: 'center', borderColor: colors.line, borderRadius: radius.pill, borderWidth: 1, flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingHorizontal: spacing.md },
  newText: { color: colors.text, fontFamily: typography.semibold, fontSize: 12 },
  emptyContainer: { paddingTop: spacing.md },
});
