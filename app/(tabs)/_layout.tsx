import { Dumbbell, Home, ListChecks, Timer } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import type { TextStyle, ViewStyle } from 'react-native';

import { colors, typography } from '@/theme';

const iconProps = { size: 20, strokeWidth: 1.8 };

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.accent,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: typography.semibold, fontSize: 10 } as TextStyle,
        tabBarStyle: { backgroundColor: colors.panel, borderTopColor: colors.line, height: 68, paddingBottom: 8, paddingTop: 7 } as ViewStyle,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ color }) => <Home {...iconProps} color={color} /> }} />
      <Tabs.Screen name="routines" options={{ title: 'Routines', tabBarIcon: ({ color }) => <ListChecks {...iconProps} color={color} /> }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarIcon: ({ color }) => <Timer {...iconProps} color={color} /> }} />
      <Tabs.Screen name="exercises" options={{ title: 'Exercises', tabBarIcon: ({ color }) => <Dumbbell {...iconProps} color={color} /> }} />
    </Tabs>
  );
}
