import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ConfiguracoesScreen } from '../screens/ConfiguracoesScreen';
import { PerfilScreen } from '../screens/PerfilScreen';
import { NotificacoesScreen } from '../screens/NotificacoesScreen';
import { PreferenciasScreen } from '../screens/PreferenciasScreen';
import { SobreScreen } from '../screens/SobreScreen';
import { COLORS } from '../constants/colors';

const Stack = createNativeStackNavigator();

export const ConfigNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.textLight,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTitleAlign: 'center',
      }}
    >
      <Stack.Screen 
        name="ConfigMain" 
        component={ConfiguracoesScreen}
        options={{
          title: 'Configurações',
        }}
      />
      <Stack.Screen 
        name="Perfil" 
        component={PerfilScreen}
        options={{
          title: 'Meu Perfil',
        }}
      />
      <Stack.Screen 
        name="Notificacoes" 
        component={NotificacoesScreen}
        options={{
          title: 'Notificações',
        }}
      />
      <Stack.Screen 
        name="Preferencias" 
        component={PreferenciasScreen}
        options={{
          title: 'Preferências',
        }}
      />
      <Stack.Screen 
        name="Sobre" 
        component={SobreScreen}
        options={{
          title: 'Sobre o EcoSafe',
        }}
      />
    </Stack.Navigator>
  );
}; 