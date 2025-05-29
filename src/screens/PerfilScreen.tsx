import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

export const PerfilScreen: React.FC = () => {
  const { usuario, logout } = useAuth();
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [nome, setNome] = useState(usuario?.nome || '');
  const [email, setEmail] = useState(usuario?.email || '');

  const salvarPerfil = () => {
    if (!nome.trim() || !email.trim()) {
      Alert.alert('Ops!', 'Preenche os campos aí');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Email inválido', 'Coloca um @ no email');
      return;
    }

    Alert.alert('Sucesso!', 'Perfil atualizado com sucesso');
    setModalEditarVisible(false);
  };

  const confirmarExcluirConta = () => {
    Alert.alert(
      'Excluir Conta',
      'Tem certeza? Essa ação não pode ser desfeita!',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive', 
          onPress: () => {
            Alert.alert('Conta excluída', 'Até logo!');
            logout();
          }
        }
      ]
    );
  };

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
        <TouchableOpacity 
          style={styles.editarBtn}
          onPress={() => setModalEditarVisible(true)}
        >
          <Ionicons name="create" size={16} color={COLORS.primary} />
          <Text style={styles.editarTexto}>Editar Perfil</Text>
        </TouchableOpacity>
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

        <TouchableOpacity style={styles.acaoBtnDanger} onPress={confirmarExcluirConta}>
          <Ionicons name="trash" size={20} color={COLORS.danger} />
          <Text style={styles.acaoTextoDanger}>Excluir Conta</Text>
          <Ionicons name="chevron-forward" size={16} color={COLORS.danger} />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalEditarVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar Perfil</Text>
              <TouchableOpacity onPress={() => setModalEditarVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={nome}
                onChangeText={setNome}
                placeholder="Seu nome"
                placeholderTextColor={COLORS.textSecondary}
              />
            </View>

            <View style={styles.campo}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.modalBotoes}>
              <TouchableOpacity 
                style={styles.botaoCancelar}
                onPress={() => setModalEditarVisible(false)}
              >
                <Text style={styles.textoCancelar}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.botaoSalvar}
                onPress={salvarPerfil}
              >
                <Text style={styles.textoSalvar}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  editarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editarTexto: {
    color: COLORS.primary,
    marginLeft: 5,
    fontWeight: '600',
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
  acaoBtnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.danger,
  },
  acaoTexto: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12,
  },
  acaoTextoDanger: {
    flex: 1,
    fontSize: 16,
    color: COLORS.danger,
    marginLeft: 12,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  campo: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.background,
  },
  modalBotoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  botaoCancelar: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },
  botaoSalvar: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    marginLeft: 10,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  textoCancelar: {
    color: COLORS.text,
    fontWeight: '600',
  },
  textoSalvar: {
    color: COLORS.textLight,
    fontWeight: '600',
  },
}); 