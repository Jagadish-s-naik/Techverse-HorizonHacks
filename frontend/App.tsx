import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { useProfileStore } from './src/store/useProfileStore';
import { initDB } from './src/services/offlineStorage';

export default function App() {
  const loadProfile = useProfileStore(state => state.loadProfile);

  useEffect(() => {
    initDB().catch(err => console.error('Failed to init DB:', err));
    loadProfile();
  }, [loadProfile]);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
