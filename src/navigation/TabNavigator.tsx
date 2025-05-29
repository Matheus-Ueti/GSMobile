import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DashboardScreen } from '../screens/DashboardScreen';
import { SensoresScreen } from '../screens/SensoresScreen';
import { AlertasScreen } from '../screens/AlertasScreen';
import { EventosScreen } from '../screens/EventosScreen';
import { ConfigNavigator } from './ConfigNavigator';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const isWeb = Platform.OS === 'web';

export const TabNavigator: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Sensores':
              iconName = focused ? 'hardware-chip' : 'hardware-chip-outline';
              break;
            case 'Alertas':
              iconName = focused ? 'warning' : 'warning-outline';
              break;
            case 'Eventos':
              iconName = focused ? 'flame' : 'flame-outline';
              break;
            case 'Configurações':
              iconName = focused ? 'settings' : 'settings-outline';
              break;
            default:
              iconName = 'help-outline';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopColor: COLORS.background,
          borderTopWidth: 1,
          paddingBottom: isWeb ? 12 : Math.max(insets.bottom + 4, 16),
          paddingTop: isWeb ? 12 : 12,
          height: isWeb ? 70 : Math.max(60 + insets.bottom, 80),
          ...(isWeb && {
            position: 'fixed' as any,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
          }),
        },
        tabBarLabelStyle: {
          fontSize: isWeb ? 14 : 12,
          fontWeight: '500',
          marginBottom: isWeb ? 0 : 2,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          title: 'EcoSafe Dashboard',
          tabBarLabel: 'Início',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Sensores" 
        component={SensoresScreen}
        options={{
          title: 'Gerenciar Sensores',
          tabBarLabel: 'Sensores',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Alertas" 
        component={AlertasScreen}
        options={{
          title: 'Alertas Ambientais',
          tabBarLabel: 'Alertas',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Eventos" 
        component={EventosScreen}
        options={{
          title: 'Eventos Ambientais',
          tabBarLabel: 'Eventos',
          headerShown: true,
          headerStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
          },
          headerTintColor: COLORS.textLight,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
          headerTitleAlign: 'center',
        }}
      />
      <Tab.Screen 
        name="Configurações" 
        component={ConfigNavigator}
        options={{
          tabBarLabel: 'Config',
        }}
      />
    </Tab.Navigator>
  );
}; 