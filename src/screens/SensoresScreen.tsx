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
import { sensorService } from '../services/api';
import { Sensor } from '../types';

export const SensoresScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sensores, setSensores] = useState<Sensor[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
  const [formData, setFormData] = useState({
    tipo: '',
    localizacao: '',
    unidade_medida: '',
    status: 'ativo',
  });

  const loadSensores = async () => {
    try {
      const response = await sensorService.getAll();
      setSensores(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar sensores:', error);
      Alert.alert('Erro', 'Não foi possível carregar os sensores');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadSensores();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadSensores();
  };

  const openModal = (sensor?: Sensor) => {
    if (sensor) {
      setEditingSensor(sensor);
      setFormData({
        tipo: sensor.tipo,
        localizacao: sensor.localizacao,
        unidade_medida: sensor.unidade_medida,
        status: sensor.status,
      });
    } else {
      setEditingSensor(null);
      setFormData({
        tipo: '',
        localizacao: '',
        unidade_medida: '',
        status: 'ativo',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingSensor(null);
    setFormData({
      tipo: '',
      localizacao: '',
      unidade_medida: '',
      status: 'ativo',
    });
  };

  const saveSensor = async () => {
    if (!formData.tipo || !formData.localizacao || !formData.unidade_medida) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingSensor) {
        await sensorService.update(editingSensor.id_sensor, formData);
        Alert.alert('Sucesso', 'Sensor atualizado com sucesso');
      } else {
        await sensorService.create(formData);
        Alert.alert('Sucesso', 'Sensor criado com sucesso');
      }
      closeModal();
      loadSensores();
    } catch (error) {
      console.error('Erro ao salvar sensor:', error);
      Alert.alert('Erro', 'Não foi possível salvar o sensor');
    }
  };

  const deleteSensor = (sensor: Sensor) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o sensor "${sensor.tipo}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await sensorService.delete(sensor.id_sensor);
              Alert.alert('Sucesso', 'Sensor excluído com sucesso');
              loadSensores();
            } catch (error) {
              console.error('Erro ao excluir sensor:', error);
              Alert.alert('Erro', 'Não foi possível excluir o sensor');
            }
          },
        },
      ]
    );
  };

  const getSensorStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ativo':
        return 'success';
      case 'inativo':
        return 'danger';
      case 'manutenção':
        return 'warning';
      default:
        return 'normal';
    }
  };

  if (loading) {
    return <Loading message="Carregando sensores..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sensores</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {sensores.map((sensor) => (
          <Card
            key={sensor.id_sensor}
            title={sensor.tipo}
            subtitle={`${sensor.localizacao} • ${sensor.unidade_medida}`}
            status={getSensorStatus(sensor.status)}
            onPress={() => openModal(sensor)}
          >
            <View style={styles.sensorActions}>
              <Text style={styles.statusText}>Status: {sensor.status}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteSensor(sensor)}
              >
                <Ionicons name="trash" size={20} color={COLORS.danger} />
              </TouchableOpacity>
            </View>
          </Card>
        ))}
      </ScrollView>

      {/* Modal de Edição/Criação */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingSensor ? 'Editar Sensor' : 'Novo Sensor'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Tipo do Sensor *</Text>
              <TextInput
                style={styles.input}
                value={formData.tipo}
                onChangeText={(text) => setFormData({ ...formData, tipo: text })}
                placeholder="Ex: Temperatura, Umidade, Pressão..."
              />

              <Text style={styles.label}>Localização *</Text>
              <TextInput
                style={styles.input}
                value={formData.localizacao}
                onChangeText={(text) => setFormData({ ...formData, localizacao: text })}
                placeholder="Ex: Prédio A - Sala 101"
              />

              <Text style={styles.label}>Unidade de Medida *</Text>
              <TextInput
                style={styles.input}
                value={formData.unidade_medida}
                onChangeText={(text) => setFormData({ ...formData, unidade_medida: text })}
                placeholder="Ex: °C, %, mmHg..."
              />

              <Text style={styles.label}>Status</Text>
              <View style={styles.statusContainer}>
                {['ativo', 'inativo', 'manutenção'].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.statusOption,
                      formData.status === status && styles.statusSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, status })}
                  >
                    <Text
                      style={[
                        styles.statusOptionText,
                        formData.status === status && styles.statusSelectedText,
                      ]}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveSensor}>
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
  sensorActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  statusText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
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
  input: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    alignItems: 'center',
  },
  statusSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  statusOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  statusSelectedText: {
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