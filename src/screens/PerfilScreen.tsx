import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

export const PerfilScreen: React.FC = () => {
  const { usuario, logout } = useAuth();

  const estatisticas = [
    { titulo: 'Sensores Monitorados', valor: '12', icone: 'hardware-chip' },
    { titulo: 'Alertas Criados', valor: '8', icone: 'warning' },
    { titulo: 'Eventos Registrados', valor: '25', icone: 'calendar' },
    { titulo: 'Dias de Uso', valor: '45', icone: 'time' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={60} color={COLORS.textLight} />
          </View>
          <TouchableOpacity style={styles.editarAvatarBtn}>
            <Ionicons name="camera" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.nome}>{usuario?.nome}</Text>
        <Text style={styles.email}>{usuario?.email}</Text>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          {estatisticas.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Ionicons name={stat.icone as any} size={24} color={COLORS.primary} />
              <Text style={styles.statValor}>{stat.valor}</Text>
              <Text style={styles.statTitulo}>{stat.titulo}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Informações da Conta</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoTexto}>Membro desde: Janeiro 2024</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
            <Text style={styles.infoTexto}>Conta Verificada</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="location" size={20} color={COLORS.textSecondary} />
            <Text style={styles.infoTexto}>São Paulo, Brasil</Text>
          </View>
        </View>
      </View>

      <View style={styles.secao}>
        <Text style={styles.tituloSecao}>Ações</Text>
        <TouchableOpacity style={styles.acaoBtn} onPress={() => Alert.alert('Exportar', 'Dados exportados com sucesso!')}>
          <Ionicons name="download" size={20} color={COLORS.primary} />
          <Text style={styles.acaoTexto}>Exportar Dados</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.acaoBtn} onPress={() => Alert.alert('Backup', 'Backup realizado!')}>
          <Ionicons name="cloud-upload" size={20} color={COLORS.primary} />
          <Text style={styles.acaoTexto}>Fazer Backup</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
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
    paddingTop: 40,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  editarAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textLight,
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  secao: {
    margin: 20,
  },
  tituloSecao: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: COLORS.surface,
    width: '48%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginVertical: 5,
  },
  statTitulo: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 15,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTexto: {
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  acaoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  acaoTexto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
}); 