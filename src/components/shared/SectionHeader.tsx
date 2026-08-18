import { View } from 'react-native';

import { createStyles } from '@/utils/createStyles';

import { AppText } from '@/components/ui/AppText';
import { Label } from '@/components/ui/Label';
import { spacing, typography } from '@/theme';

export function SectionHeader({ label, title, action }: { label: string; title: string; action?: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <View>
        <Label>{label}</Label>
        <AppText style={styles.title}>{title}</AppText>
      </View>
      {action}
    </View>
  );
}

const styles = createStyles({
  row: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontFamily: typography.extraBold, fontSize: 34, letterSpacing: -1.5, marginTop: spacing.xs },
});
