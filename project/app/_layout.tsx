import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts, NotoSansThai_400Regular, NotoSansThai_700Bold } from '@expo-google-fonts/noto-sans-thai';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { DataManager } from '@/utils/DataManager';
import { NotificationManager } from '@/utils/NotificationManager';
import { MoodTracker } from '@/utils/MoodTracker';
import { GamificationManager } from '@/utils/GamificationManager';

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded] = useFonts({
    'NotoSansThai-Regular': NotoSansThai_400Regular,
    'NotoSansThai-Bold': NotoSansThai_700Bold,
  });

  useEffect(() => {
    // Initialize data management and notifications
    const initializeApp = async () => {
      try {
        await DataManager.initialize();
        await NotificationManager.initialize();
        await MoodTracker.initialize();
        await GamificationManager.initialize();
        await NotificationManager.scheduleMotivationalNotifications();
        await NotificationManager.scheduleCravingReminders();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}