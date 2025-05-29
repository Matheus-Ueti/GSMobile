import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { Loading } from '../components/common/Loading';
import { COLORS } from '../constants/colors';
import { eventoService, localService } from '../services/api';
import { Evento, Local } from '../types';

export const EventosScreen: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [locais, setLocais] = useState<Local[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);
  const [formData, setFormData] = useState({
    tipo_evento: '',
    id_local: 0,
    nivel_risco: 'baixo',
    detalhes: '',
  });

  const loadData = async () => {
    try {
      const [eventosResponse, locaisResponse] = await Promise.all([
        eventoService.getAll(),
        localService.getAll(),
      ]);
      setEventos(eventosResponse.data || []);
      setLocais(locaisResponse.data || []);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      Alert.alert('Erro', 'Não foi possível carregar os eventos');
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

  const openModal = (evento?: Evento) => {
    if (evento) {
      setEditingEvento(evento);
      setFormData({
        tipo_evento: evento.tipo_evento,
        id_local: evento.id_local,
        nivel_risco: evento.nivel_risco,
        detalhes: evento.detalhes,
      });
    } else {
      setEditingEvento(null);
      setFormData({
        tipo_evento: '',
        id_local: locais.length > 0 ? locais[0].id_local : 0,
        nivel_risco: 'baixo',
        detalhes: '',
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingEvento(null);
    setFormData({
      tipo_evento: '',
      id_local: locais.length > 0 ? locais[0].id_local : 0,
      nivel_risco: 'baixo',
      detalhes: '',
    });
  };

  const saveEvento = async () => {
    if (!formData.tipo_evento || formData.id_local === 0) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const eventoData = {
        ...formData,
        data_evento: new Date().toISOString(),
      };

      if (editingEvento) {
        await eventoService.update(editingEvento.id_evento, eventoData);
        Alert.alert('Sucesso', 'Evento atualizado com sucesso');
      } else {
        await eventoService.create(eventoData);
        Alert.alert('Sucesso', 'Evento criado com sucesso');
      }
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
      Alert.alert('Erro', 'Não foi possível salvar o evento');
    }
  };

  const deleteEvento = (evento: Evento) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir o evento "${evento.tipo_evento}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await eventoService.delete(evento.id_evento);
              Alert.alert('Sucesso', 'Evento excluído com sucesso');
              loadData();
            } catch (error) {
              console.error('Erro ao excluir evento:', error);
              Alert.alert('Erro', 'Não foi possível excluir o evento');
            }
          },
        },
      ]
    );
  };

  const getRiscoStatus = (nivel: string) => {
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

  const getLocalById = (id: number) => {
    return locais.find(local => local.id_local === id);
  };

  const getTipoEventoIcon = (tipo: string) => {
    const tipoLower = tipo.toLowerCase();
    if (tipoLower.includes('enchente') || tipoLower.includes('inundação')) {
      return 'water';
    } else if (tipoLower.includes('incêndio') || tipoLower.includes('fogo')) {
      return 'flame';
    } else if (tipoLower.includes('vento') || tipoLower.includes('tempestade')) {
      return 'cloudy';
    }
    return 'warning';
  };

  if (loading) {
    return <Loading message="Carregando eventos..." />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Eventos</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => openModal()}>
          <Ionicons name="add" size={24} color={COLORS.textLight} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {eventos.map((evento) => {
          const local = getLocalById(evento.id_local);
          return (
            <Card
              key={evento.id_evento}
              title={evento.tipo_evento}
              subtitle={`${local?.nome || 'Local não encontrado'} • ${formatarData(evento.data_evento)}`}
              status={getRiscoStatus(evento.nivel_risco)}
              onPress={() => openModal(evento)}
            >
              <View style={styles.eventoInfo}>
                <View style={styles.eventoDetails}>
                  <View style={styles.riscoContainer}>
                    <Ionicons 
                      name={getTipoEventoIcon(evento.tipo_evento)} 
                      size={16} 
                      color={COLORS.textSecondary} 
                    />
                    <Text style={styles.riscoText}>
                      Risco: {evento.nivel_risco.toUpperCase()}
                    </Text>
                  </View>
                  {evento.detalhes && (
                    <Text style={styles.detalhesText} numberOfLines={2}>
                      {evento.detalhes}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteEvento(evento)}
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
                {editingEvento ? 'Editar Evento' : 'Novo Evento'}
              </Text>
              <TouchableOpacity onPress={closeModal}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.label}>Tipo de Evento *</Text>
              <View style={styles.tipoContainer}>
                {['Enchente', 'Incêndio Florestal', 'Vento Forte', 'Tempestade'].map((tipo) => (
                  <TouchableOpacity
                    key={tipo}
                    style={[
                      styles.tipoOption,
                      formData.tipo_evento === tipo && styles.tipoSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, tipo_evento: tipo })}
                  >
                    <Ionicons 
                      name={getTipoEventoIcon(tipo)} 
                      size={20} 
                      color={formData.tipo_evento === tipo ? COLORS.textLight : COLORS.text} 
                    />
                    <Text
                      style={[
                        styles.tipoOptionText,
                        formData.tipo_evento === tipo && styles.tipoSelectedText,
                      ]}
                    >
                      {tipo}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Tipo Personalizado</Text>
              <TextInput
                style={styles.input}
                value={formData.tipo_evento}
                onChangeText={(text) => setFormData({ ...formData, tipo_evento: text })}
                placeholder="Ou digite um tipo personalizado..."
              />

              <Text style={styles.label}>Local *</Text>
              <View style={styles.localContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {locais.map((local) => (
                    <TouchableOpacity
                      key={local.id_local}
                      style={[
                        styles.localOption,
                        formData.id_local === local.id_local && styles.localSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, id_local: local.id_local })}
                    >
                      <Text
                        style={[
                          styles.localOptionText,
                          formData.id_local === local.id_local && styles.localSelectedText,
                        ]}
                      >
                        {local.nome}
                      </Text>
                      <Text
                        style={[
                          styles.localSubtext,
                          formData.id_local === local.id_local && styles.localSelectedText,
                        ]}
                      >
                        {local.cidade}, {local.estado}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.label}>Nível de Risco</Text>
              <View style={styles.riscoContainer2}>
                {['baixo', 'médio', 'alto', 'crítico'].map((nivel) => (
                  <TouchableOpacity
                    key={nivel}
                    style={[
                      styles.riscoOption,
                      formData.nivel_risco === nivel && styles.riscoSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, nivel_risco: nivel })}
                  >
                    <Text
                      style={[
                        styles.riscoOptionText,
                        formData.nivel_risco === nivel && styles.riscoSelectedText,
                      ]}
                    >
                      {nivel.charAt(0).toUpperCase() + nivel.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.label}>Detalhes</Text>
              <TextInput
                style={styles.textArea}
                value={formData.detalhes}
                onChangeText={(text) => setFormData({ ...formData, detalhes: text })}
                placeholder="Descreva os detalhes do evento..."
                multiline
                numberOfLines={4}
              />
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={saveEvento}>
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
  eventoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 8,
  },
  eventoDetails: {
    flex: 1,
  },
  riscoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  riscoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginLeft: 4,
  },
  detalhesText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
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
    width: '95%',
    maxHeight: '90%',
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
  tipoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tipoOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    minWidth: '45%',
  },
  tipoSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  tipoOptionText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: 6,
  },
  tipoSelectedText: {
    color: COLORS.textLight,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: COLORS.surface,
  },
  localContainer: {
    marginBottom: 8,
  },
  localOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    minWidth: 120,
  },
  localSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  localOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  localSubtext: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  localSelectedText: {
    color: COLORS.textLight,
  },
  riscoContainer2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  riscoOption: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.background,
    alignItems: 'center',
  },
  riscoSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  riscoOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  riscoSelectedText: {
    color: COLORS.textLight,
    fontWeight: '500',
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