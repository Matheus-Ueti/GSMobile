import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { COLORS } from './src/constants/colors';

// Componente principal do app - aqui começa tudo
// O professor disse que é como se fosse o index.html de uma página web
export default function App() {
  return (
    // SafeAreaProvider - garante que o app não fique embaixo do notch do iPhone
    <SafeAreaProvider>
      {/* AuthProvider - gerencia se o usuário está logado ou não */}
      <AuthProvider>
        {/* NavigationContainer - permite navegar entre as telas */}
        <NavigationContainer>
          {/* AppNavigator - define quais são as telas do app */}
          <AppNavigator />
          
          {/* StatusBar - configura a barra de status do celular */}
          <StatusBar style="light" backgroundColor={COLORS.primary} />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

// TODO: Talvez adicionar um splash screen aqui?
// NOTE: Lembrar de testar em Android e iOS
