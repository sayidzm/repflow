import type { ComponentProps, ReactNode } from 'react';
import { Pressable } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { colors, radius } from '@/theme';

type IconButtonProps = Omit<ComponentProps<typeof Pressable>, 'children'> & {
  children: ReactNode;
  accessibilityLabel: string;
};

export function IconButton({ children, style, ...props }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={4}
      {...props}
      style={(state) => [styles.button, state.pressed && styles.pressed, typeof style === 'function' ? style(state) : style]}
    >
      {children}
    </Pressable>
  );
}

const styles = createStyles({
  button: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: colors.line,
    borderRadius: radius.pill,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  pressed: { opacity: 0.72 },
});
