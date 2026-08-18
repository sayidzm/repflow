import { Ellipsis, Edit3, Play, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { ActionSheetModal } from '@/components/ui/ActionSheetModal';
import { AppText } from '@/components/ui/AppText';
import type { Routine } from '@/domain/models/routine';
import { colors, radius, spacing, typography } from '@/theme';

type Props = {
  routine: Routine;
  onStart: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function RoutineCard({ routine, onStart, onEdit, onDelete }: Props) {
  const [optionsVisible, setOptionsVisible] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.heading}>
        <View style={styles.headingCopy}>
          <AppText style={styles.name}>{routine.name}</AppText>
          <AppText style={styles.count}>{routine.exercises.length} Egzersiz</AppText>
        </View>
        {(onEdit || onDelete) && (
          <Pressable
            accessibilityLabel={`${routine.name} seçenekleri`}
            accessibilityRole="button"
            hitSlop={10}
            onPress={() => setOptionsVisible(true)}
            style={styles.options}
          >
            <Ellipsis color={colors.text} size={20} />
          </Pressable>
        )}
      </View>

      <View style={styles.list}>
        {routine.exercises.length === 0 ? (
          <AppText style={styles.emptyText}>Henüz egzersiz eklenmedi.</AppText>
        ) : (
          routine.exercises.map((re) => (
            <AppText key={re.id} style={styles.exercise}>
              {re.exerciseName || 'Egzersiz'}
            </AppText>
          ))
        )}
      </View>

      <View style={styles.footer}>
        <AppText style={styles.last}>En son {routine.lastPerformed || 'Hiç yapılmadı'}</AppText>
        <Pressable accessibilityLabel={`${routine.name} başlat`} accessibilityRole="button" onPress={onStart} style={styles.start}>
          <AppText style={styles.startText}>Başlat</AppText>
          <Play color={colors.ink} fill={colors.ink} size={13} />
        </Pressable>
      </View>

      <ActionSheetModal
        onClose={() => setOptionsVisible(false)}
        options={[
          ...(onEdit
            ? [
                {
                  label: 'Rutini Düzenle',
                  icon: <Edit3 color={colors.text} size={18} />,
                  onPress: onEdit,
                },
              ]
            : []),
          ...(onDelete
            ? [
                {
                  label: 'Rutini Sil',
                  icon: <Trash2 color="#ef4444" size={18} />,
                  style: 'destructive' as const,
                  onPress: onDelete,
                },
              ]
            : []),
        ]}
        title={routine.name}
        visible={optionsVisible}
      />
    </View>
  );
}

const styles = createStyles({
  card: { backgroundColor: colors.panel, borderColor: colors.line, borderRadius: radius.lg, borderWidth: 1, padding: spacing.md },
  heading: { alignItems: 'flex-start', flexDirection: 'row', justifyContent: 'space-between' },
  headingCopy: { flex: 1 },
  name: { fontFamily: typography.bold, fontSize: 20 },
  count: { color: colors.muted, fontFamily: typography.mono, fontSize: 9, textTransform: 'uppercase', marginTop: 2 },
  options: { alignItems: 'center', height: 44, justifyContent: 'center', marginRight: -10, marginTop: -10, width: 44 },
  list: { borderBottomColor: colors.line, borderBottomWidth: 1, borderTopColor: colors.line, borderTopWidth: 1, gap: 7, marginVertical: spacing.md, paddingVertical: spacing.md },
  exercise: { color: colors.muted, fontFamily: typography.regular, fontSize: 13 },
  emptyText: { color: colors.muted, fontFamily: typography.regular, fontSize: 12, fontStyle: 'italic' },
  footer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  last: { color: colors.muted, flex: 1, fontFamily: typography.regular, fontSize: 10 },
  start: { alignItems: 'center', backgroundColor: colors.accent, borderRadius: radius.pill, flexDirection: 'row', gap: spacing.xs, minHeight: 44, paddingHorizontal: spacing.md },
  startText: { color: colors.ink, fontFamily: typography.bold, fontSize: 12 },
});
