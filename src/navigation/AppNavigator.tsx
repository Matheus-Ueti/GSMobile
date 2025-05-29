import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '../screens/LoginScreen';
import { TabNavigator } from './TabNavigator';
import { useAuth } from '../contexts/AuthContext';
import { Loading } from '../components/common/Loading';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  const { estaLogado, carregando } = useAuth();

  if (carregando) {
    return <Loading message="Verificando login..." />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {estaLogado ? (
        <Stack.Screen name="Main" component={TabNavigator} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}; 