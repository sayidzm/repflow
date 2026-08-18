import React from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { colors, radius, spacing, typography } from '@/theme';

export type ActionSheetOption = {
  label: string;
  icon?: React.ReactNode;
  style?: 'default' | 'destructive';
  onPress: () => void;
};

export type ActionSheetModalProps = {
  visible: boolean;
  title?: string;
  description?: string;
  options: ActionSheetOption[];
  onClose: () => void;
};

export function ActionSheetModal({
  visible,
  title,
  description,
  options,
  onClose,
}: ActionSheetModalProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal animationType="fade" onRequestClose={onClose} transparent visible={visible}>
      <Pressable onPress={onClose} style={styles.overlay}>
        <View
          onStartShouldSetResponder={() => true}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}
        >
          {title ? (
            <View style={styles.header}>
              <AppText style={styles.title}>{title}</AppText>
              {description ? <AppText style={styles.description}>{description}</AppText> : null}
            </View>
          ) : null}

          <ScrollView contentContainerStyle={styles.optionsList} bounces={false}>
            {options.map((option, index) => {
              const isDestructive = option.style === 'destructive';
              return (
                <Pressable
                  accessibilityRole="button"
                  key={`${option.label}-${index}`}
                  onPress={() => {
                    onClose();
                    option.onPress();
                  }}
                  style={(state) => [
                    styles.optionRow,
                    isDestructive && styles.destructiveRow,
                    state.pressed && styles.pressedRow,
                  ]}
                >
                  {option.icon ? <View style={styles.iconContainer}>{option.icon}</View> : null}
                  <AppText
                    style={[
                      styles.optionText,
                      isDestructive && styles.destructiveText,
                    ]}
                  >
                    {option.label}
                  </AppText>
                </Pressable>
              );
            })}
          </ScrollView>

          <Pressable accessibilityRole="button" onPress={onClose} style={styles.cancelButton}>
            <AppText style={styles.cancelText}>Cancel</AppText>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = createStyles({
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    flex: 1,
    justify: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.panelRaised,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.line,
    borderBottomWidth: 1,
    paddingBottom: spacing.md,
  },
  title: {
    fontFamily: typography.bold,
    fontSize: 16,
    textAlign: 'center',
  },
  description: {
    color: colors.muted,
    fontFamily: typography.regular,
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  optionsList: {
    gap: spacing.xs,
  },
  optionRow: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: spacing.md,
  },
  destructiveRow: {
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  pressedRow: {
    opacity: 0.75,
  },
  iconContainer: {
    marginRight: 4,
  },
  optionText: {
    fontFamily: typography.semibold,
    fontSize: 14,
  },
  destructiveText: {
    color: '#ef4444',
  },
  cancelButton: {
    alignItems: 'center',
    borderColor: colors.line,
    borderRadius: radius.md,
    borderWidth: 1,
    justify: 'center',
    minHeight: 48,
    marginTop: spacing.xs,
  },
  cancelText: {
    color: colors.muted,
    fontFamily: typography.semibold,
    fontSize: 14,
  },
});
