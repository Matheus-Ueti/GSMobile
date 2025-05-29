import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TabNavigator } from './src/navigation/TabNavigator';
import { COLORS } from './src/constants/colors';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <TabNavigator />
        <StatusBar style="light" backgroundColor={COLORS.primary} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
