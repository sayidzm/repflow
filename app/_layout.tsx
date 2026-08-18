import { DMMono_400Regular, DMMono_500Medium, useFonts as useDmMonoFonts } from '@expo-google-fonts/dm-mono';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts as useManropeFonts,
} from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { SQLiteProvider } from 'expo-sqlite';
import { useEffect } from 'react';
import type { ViewStyle } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { WorkoutDraftProvider } from '@/providers/WorkoutDraftProvider';
import { initializeDatabase } from '@/database/initializeDatabase';
import { colors } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [manropeLoaded] = useManropeFonts({ Manrope_400Regular, Manrope_500Medium, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  const [monoLoaded] = useDmMonoFonts({ DMMono_400Regular, DMMono_500Medium });
  const loaded = manropeLoaded && monoLoaded;

  useEffect(() => {
    if (loaded) void SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="repflow.db" onInit={initializeDatabase} useSuspense>
        <WorkoutDraftProvider>
          <Stack screenOptions={{ contentStyle: { backgroundColor: colors.ink } as ViewStyle, headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="workout/active" options={{ presentation: 'fullScreenModal' }} />
            <Stack.Screen name="exercises/select" options={{ presentation: 'modal' }} />
          </Stack>
        </WorkoutDraftProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
