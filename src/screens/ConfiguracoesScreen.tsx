import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../constants/colors';

export const ConfiguracoesScreen: React.FC = () => {
  const { usuario, logout } = useAuth();
  const navigation = useNavigation();

  const confirmarLogout = () => {
    Alert.alert(
      'Sair do app',
      'Tem certeza que quer sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: logout }
      ]
    );
  };

  const opcoes = [
    { 
      id: 1, 
      titulo: 'Perfil', 
      icone: 'person', 
      acao: () => navigation.navigate('Perfil' as never)
    },
    { 
      id: 2, 
      titulo: 'Sobre', 
      icone: 'information-circle', 
      acao: () => navigation.navigate('Sobre' as never)
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={40} color={COLORS.textLight} />
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{usuario?.nome || 'Usuário'}</Text>
            <Text style={styles.userEmail}>{usuario?.email || 'email@example.com'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        {opcoes.map((opcao) => (
          <TouchableOpacity
            key={opcao.id}
            style={styles.option}
            onPress={opcao.acao}
          >
            <View style={styles.optionLeft}>
              <Ionicons name={opcao.icone as any} size={24} color={COLORS.primary} />
              <Text style={styles.optionText}>{opcao.titulo}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={confirmarLogout}
        >
          <Ionicons name="log-out" size={24} color={COLORS.danger} />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  section: {
    marginTop: 20,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 10,
    fontWeight: '600',
  },
}); 