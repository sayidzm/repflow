import { StyleSheet } from 'react-native';

/**
 * Wrapper around StyleSheet.create that returns properly typed styles.
 * Fixes React Native 0.87+ strict style type narrowing issues where
 * StyleSheet.create's return type (Readonly<S>) doesn't satisfy
 * component style props due to widened union members.
 */
export function createStyles<const T extends Record<string, object>>(
  styles: T,
): { [K in keyof T]: any } {
  return StyleSheet.create(styles as any) as any;
}
