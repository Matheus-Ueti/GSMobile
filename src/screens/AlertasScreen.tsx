import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../constants/colors';
import { alertaService, eventoService } from '../services/api';
import { Alerta, Evento } from '../types';

export const AlertasScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAlerta, setEditingAlerta] = useState<Alerta | null>(null);
  const [formData, setFormData] = useState({
    id_evento: 0,
    mensagem: '',
    nivel_urgencia: 'baixo',
  });

  const loadData = async () => {
    try {
      const [alertasResponse, eventosResponse] = await Promise.all([
        alertaService.getAll(),
        eventoService.getAll(),
      ]);
      setAlertas(alertasResponse.data || []);
      setEventos(eventosResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      Alert.alert('Erro', 'Não foi possível carregar os alertas');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const openModal = (alerta?: Alerta) => {
    if (alerta) {
      setEditingAlerta(alerta);
      setFormData({
        id_evento: alerta.id_evento,
        mensagem: alerta.mensagem,
        nivel_urgencia: alerta.nivel_urgencia,
      });
    } else {
      setEditingAlerta(null);
      setFormData({
        id_evento: eventos.length > 0 ? eventos[0].id_evento : 0,
        mensagem: '',
        nivel_urgencia: 'baixo',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingAlerta(null);
    setFormData({
      id_evento: eventos.length > 0 ? eventos[0].id_evento : 0,
      mensagem: '',
      nivel_urgencia: 'baixo',
    });
  };

  const saveAlerta = async () => {
    if (!formData.mensagem || formData.id_evento === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const alertaData = {
        ...formData,
        data_hora: new Date().toISOString(),
      };

      if (editingAlerta) {
        await alertaService.update(editingAlerta.id_alerta, alertaData);
        Alert.alert('Sucesso', 'Alerta atualizado com sucesso');
      } else {
        await alertaService.create(alertaData);
        Alert.alert('Sucesso', 'Alerta criado com sucesso');
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar alerta:', error);
      Alert.alert('Erro', 'Não foi possível salvar o alerta');
    }
  };

  const deleteAlerta = (alerta: Alerta) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir este alerta?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await alertaService.delete(alerta.id_alerta);
              Alert.alert('Sucesso', 'Alerta excluído com sucesso');
              loadData();
            } catch (error) {
              console.error('Erro ao excluir alerta:', error);
              Alert.alert('Erro', 'Não foi possível excluir o alerta');
            }
          },
        },
      ]
    );
  };

  const getAlertaStatus = (nivel: string) => {
    switch (nivel.toLowerCase()) {
      case 'crítico':
      case 'alto':
        return 'danger';
      case 'médio':
        return 'warning';
      case 'baixo':
        return 'success';
      default:
        return 'normal';
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR');
  };

  const getEventoById = (id: number) => {
    return eventos.find(evento => evento.id_evento === id);
  };

  if (loading) {
    return <Loading message="Carregando alertas..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Alertas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {alertas.map((alerta) => {
          const evento = getEventoById(alerta.id_evento);
          return (
            <Card
              key={alerta.id_alerta}
              title={alerta.mensagem}
              subtitle={`${evento?.tipo_evento || 'Evento não encontrado'} • ${formatarData(alerta.data_hora)}`}
              status={getAlertaStatus(alerta.nivel_urgencia)}
              onPress={() => openModal(alerta)}
            >
              <View style={styles.alertaInfo}>
                <Text style={styles.urgenciaText}>
                  Urgência: {alerta.nivel_urgencia.toUpperCase()}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteAlerta(alerta)}
                >
                  <Ionicons name="trash" size={20} color={COLORS.danger} />
                </TouchableOpacity>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      {/* Modal de Edição/Criação */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAlerta ? 'Editar Alerta' : 'Novo Alerta'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Evento *</Text>
              <View style={styles.pickerContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {eventos.map((evento) => (
                    <TouchableOpacity
                      key={evento.id_evento}
                      style={[
                        styles.eventoOption,
                        formData.id_evento === evento.id_evento && styles.eventoSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, id_evento: evento.id_evento })}
                    >
                      <Text
                        style={[
                          styles.eventoOptionText,
                          formData.id_evento === evento.id_evento && styles.eventoSelectedText,
                        ]}
                      >
                        {evento.tipo_evento}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.label}>Mensagem *</Text>
              <TextInput
                style={styles.textArea}
                value={formData.mensagem}
                onChangeText={(text) => setFormData({ ...formData, mensagem: text })}
                placeholder="Descreva o alerta..."
                multiline
                numberOfLines={4}
              />

              <Text style={styles.label}>Nível de Urgência</Text>
              <View style={styles.urgenciaContainer}>
                {['baixo', 'médio', 'alto', 'crítico'].map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.urgenciaOption,
                      formData.nivel_urgencia === nivel && styles.urgenciaSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, nivel_urgencia: nivel })}
                  >
                    <Text
                      style={[
                        styles.urgenciaOptionText,
                        formData.nivel_urgencia === nivel && styles.urgenciaSelectedText,
                      ]}
                    >
                      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveAlerta}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  alertaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  urgenciaText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  deleteButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  modalBody: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    marginBottom: 8,
  },
  eventoOption: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
  },
  eventoSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  eventoOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  eventoSelectedText: {
    color: COLORS.textLight,
  },
  textArea: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  urgenciaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  urgenciaOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    alignItems: 'center',
  },
  urgenciaSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  urgenciaOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  urgenciaSelectedText: {
    color: COLORS.textLight,
    fontWeight: '500',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.textSecondary,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    color: COLORS.textLight,
    fontWeight: '500',
  },
}); 